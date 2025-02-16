addEventListener("fetch", event => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const { request } = event;

  try {
    // Definir directamente la URL del servidor de renderizado
    const RENDER_SERVER = "https://render.portalmicanva.com";

    console.log(`Usando RENDER_SERVER: ${RENDER_SERVER}`);

    const url = new URL(request.url);
    let userAgent = request.headers.get("user-agent") || "";

    // Convertir User-Agent a minúsculas
    const lowerUserAgent = userAgent.toLowerCase();

    // Verificar si el User-Agent es un bot
    const isBot = BOT_AGENTS.some(bot => lowerUserAgent.includes(bot.toLowerCase()));

    console.log(`Request URL: ${url.href}`);
    console.log(`User-Agent: ${userAgent}`);
    console.log(`Is Bot: ${isBot}`);

    // Verificar si la solicitud es para un recurso ignorado basado en la extensión
    const pathname = url.pathname;
    const hasIgnoredExtension = IGNORE_EXTENSIONS.some(ext => pathname.toLowerCase().endsWith(ext));

    if (hasIgnoredExtension) {
      console.log(`La ruta ${pathname} tiene una extensión ignorada. Devolviendo contenido original.`);
      return fetch(request);
    }

    // Si esta petición ya viene del Puppeteer server (con ?botRender=true), devolver contenido original
    const isRenderCall = url.searchParams.get("botRender") === "true";
    if (isRenderCall) {
      console.log("Llamada desde Puppeteer (botRender=true). Devolviendo contenido sin cambios.");
      return fetch(request);
    }

    // Verificar si la ruta debe ser ignorada
    const shouldIgnore = ignoredPaths.some(path => url.pathname.startsWith(path));
    if (shouldIgnore) {
      console.log(`La ruta ${url.pathname} está en la lista de ignorados. Devolviendo contenido original.`);
      return fetch(request);
    }

    if (isBot) {
      // Si la ruta ya es /producto-share/, devolvemos el contenido sin cambios
      if (url.pathname.startsWith("/producto-share")) {
        console.log("Ruta /producto-share/ detectada en modo bot. Devolviendo contenido sin redirecciones.");
        return fetch(request);
      }

      // Si es bot y la ruta inicia con /producto/, la cambiamos a /producto-share/
      if (url.pathname.startsWith("/producto/")) {
        const oldPath = url.pathname;
        url.pathname = url.pathname.replace("/producto/", "/producto-share/");
        console.log(`Ruta modificada para SEO: de ${oldPath} a ${url.pathname}`);
      } else {
        console.log("Es bot, pero la ruta no inicia con /producto/. Se devolverá contenido bot render.");
      }

      // Llamada al Puppeteer server con el parámetro botRender=true para evitar bucles
      const puppeteerServerUrl = `${RENDER_SERVER}/render?url=${encodeURIComponent(url.toString())}&botRender=true`;
      console.log(`Llamando a Puppeteer Server: ${puppeteerServerUrl}`);

      try {
        const response = await fetch(puppeteerServerUrl);
        if (!response.ok) {
          console.error(`Error al renderizar la página: ${response.statusText}`);
          return new Response("Error al renderizar la página.", { status: 500 });
        }

        const html = await response.text();
        return new Response(html, { headers: { "Content-Type": "text/html" } });
      } catch (error) {
        console.error(`Error en la solicitud al renderizador: ${error}`);
        return new Response("Error interno.", { status: 500 });
      }
    }

    return fetch(request);
  } catch (error) {
    console.error(`Error en el Worker: ${error}`);
    return new Response("Error en el Worker.", { status: 500 });
  }
}

// ✅ Listas de Bots y Extensiones Ignoradas
const ignoredPaths = [];

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

const IGNORE_EXTENSIONS = [
  ".js", ".css", ".xml", ".less", ".png", ".jpg", ".jpeg", ".gif",
  ".pdf", ".doc", ".txt", ".ico", ".rss", ".zip", ".mp3", ".rar",
  ".exe", ".wmv", ".avi", ".ppt", ".mpg", ".mpeg", ".tif", ".wav",
  ".mov", ".psd", ".ai", ".xls", ".mp4", ".m4a", ".swf", ".dat",
  ".dmg", ".iso", ".flv", ".m4v", ".torrent", ".woff", ".ttf", ".svg", ".webmanifest"
];
