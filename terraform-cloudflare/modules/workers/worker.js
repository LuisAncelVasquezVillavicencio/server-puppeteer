addEventListener("fetch", event => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const { request } = event;
  const url = new URL(request.url);

  // 📌 Definir el servidor de renderizado Puppeteer
  const RENDER_SERVER = "https://render.portalmicanva.com";
  const domain = url.hostname.replace(/^www\./, ''); // Obtener dominio limpio

  console.log(`📌 Petición entrante: ${url.href}`);
  console.log(`📌 Dominio detectado: ${domain}`);

  // 📌 ✅ Redirigir `robots.txt` y `sitemap.xml` a la ruta completa del dominio en el servidor Node.js
  if (url.pathname === "/robots.txt" || url.pathname === "/sitemap.xml") {
    const fullPath = `${RENDER_SERVER}/public/${domain}${url.pathname}`;
    console.log(`📌 Redirigiendo a: ${fullPath}`);

    return fetch(fullPath, {
      headers: { "X-Requested-Domain": domain }
    });
  }

  // 📌 Extraer User-Agent y verificar si es un bot
  let userAgent = request.headers.get("user-agent") || "";
  const lowerUserAgent = userAgent.toLowerCase();
  const isBot = BOT_AGENTS.some(bot => lowerUserAgent.includes(bot.toLowerCase()));

  console.log(`📌 User-Agent: ${userAgent}`);
  console.log(`📌 Es bot: ${isBot}`);

  // 📌 Verificar si la solicitud es para un recurso ignorado (ejemplo: imágenes, CSS)
  const pathname = url.pathname;
  const hasIgnoredExtension = IGNORE_EXTENSIONS.some(ext => pathname.toLowerCase().endsWith(ext));

  if (hasIgnoredExtension) {
    console.log(`📌 La ruta ${pathname} es un recurso estático. Devolviendo contenido original.`);
    return fetch(request);
  }

  // 📌 Evitar bucles detectando si ya es una llamada de Puppeteer (botRender=true)
  const isRenderCall = url.searchParams.get("botRender") === "true";
  if (isRenderCall) {
    console.log("📌 Llamada desde Puppeteer detectada. Devolviendo contenido sin cambios.");
    return fetch(request);
  }

  // 📌 Verificar si la ruta debe ser ignorada
  const shouldIgnore = ignoredPaths.some(path => url.pathname.startsWith(path));
  if (shouldIgnore) {
    console.log(`📌 La ruta ${url.pathname} está en la lista de ignorados. Devolviendo contenido original.`);
    return fetch(request);
  }

  // 📌 Si es un bot, modificar la URL para SEO y renderizar con Puppeteer
  if (isBot) {
    if (url.pathname.startsWith("/producto/")) {
      const oldPath = url.pathname;
      url.pathname = url.pathname.replace("/producto/", "/producto-share/");
      console.log(`📌 Ruta modificada para SEO: de ${oldPath} a ${url.pathname}`);
    }

    // 📌 Llamar al servidor Puppeteer con el parámetro botRender=true
    const puppeteerServerUrl = `${RENDER_SERVER}/render?url=${encodeURIComponent(url.toString())}&botRender=true`;
    console.log(`📌 Llamando a Puppeteer Server: ${puppeteerServerUrl}`);

    try {
      const response = await fetch(puppeteerServerUrl);
      if (!response.ok) {
        console.error(`❌ Error al renderizar la página: ${response.statusText}`);
        return new Response("Error al renderizar la página.", { status: 500 });
      }

      const html = await response.text();
      return new Response(html, { headers: { "Content-Type": "text/html" } });
    } catch (error) {
      console.error(`❌ Error en la solicitud al renderizador: ${error}`);
      return new Response("Error interno.", { status: 500 });
    }
  }

  // 📌 Devolver contenido original para otros casos
  return fetch(request);
}

// ✅ Lista de Bots para detección
const BOT_AGENTS = [
  "googlebot", "yahoo! slurp", "bingbot", "yandex", "baiduspider",
  "facebookexternalhit", "twitterbot", "rogerbot", "linkedinbot",
  "embedly", "quora link preview", "showyoubot", "outbrain", "pinterest/0.",
  "developers.google.com/+/web/snippet", "slackbot", "vkshare", "w3c_validator",
  "redditbot", "applebot", "whatsapp", "flipboard", "tumblr", "bitlybot",
  "skypeuripreview", "nuzzel", "discordbot", "google page speed", "qwantify",
  "pinterestbot", "bitrix link preview", "xing-contenttabreceiver", "chrome-lighthouse",
  "telegrambot", "integration-test", "google-inspectiontool"
];

// ✅ Lista de extensiones ignoradas
const IGNORE_EXTENSIONS = [
  ".js", ".css", ".xml", ".less", ".png", ".jpg", ".jpeg", ".gif",
  ".pdf", ".doc", ".txt", ".ico", ".rss", ".zip", ".mp3", ".rar",
  ".exe", ".wmv", ".avi", ".ppt", ".mpg", ".mpeg", ".tif", ".wav",
  ".mov", ".psd", ".ai", ".xls", ".mp4", ".m4a", ".swf", ".dat",
  ".dmg", ".iso", ".flv", ".m4v", ".torrent", ".woff", ".ttf", ".svg", ".webmanifest"
];

// ✅ Lista de rutas ignoradas (ajústala según necesidad)
const ignoredPaths = [];
