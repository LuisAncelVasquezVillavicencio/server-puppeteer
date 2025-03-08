addEventListener("fetch", event => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const { request } = event;
  const url = new URL(request.url);
  const domain = url.hostname.replace(/^www\./, '');

  // Listas definidas (bots, extensiones a ignorar, rutas ignoradas, etc.)
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
  const ignoredPaths = [];

  // Extraer el User-Agent y determinar si es bot
  const userAgent = request.headers.get("user-agent") || "";
  const lowerUserAgent = userAgent.toLowerCase();
  const isBot = BOT_AGENTS.some(bot => lowerUserAgent.includes(bot.toLowerCase()));

  // Verificar rutas y extensiones ignoradas
  if (url.pathname === "/robots.txt" || url.pathname === "/sitemap.xml") {
    const fullPath = `https://render.portalmicanva.com/public/${domain}${url.pathname}`;
    return fetch(fullPath, { headers: { "X-Requested-Domain": domain } });
  }

  const pathname = url.pathname;
  const hasIgnoredExtension = IGNORE_EXTENSIONS.some(ext => pathname.toLowerCase().endsWith(ext));
  if (hasIgnoredExtension) {
    return fetch(request);
  }
  if (ignoredPaths.some(path => url.pathname.startsWith(path))) {
    return fetch(request);
  }
  if (url.searchParams.get("botRender") === "true") {
    return fetch(request);
  }

  // Preparar la data de la solicitud para enviarla a tu servidor de logging
  const requestData = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    queryParams: Object.fromEntries(url.searchParams.entries()),
    body: request.method !== "GET" ? await request.text() : null,
    timestamp: Date.now(),
    isBot
  };

  // Enviar POST asíncrono con event.waitUntil para registrar la solicitud (independiente de si es bot o usuario)
  event.waitUntil(
    fetch("https://render.portalmicanva.com/api/log-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData)
    }).catch(err => console.error("Error al enviar log:", err))
  );

  // Si es bot, enviamos la data a Puppeteer para renderizar
  if (isBot) {
    try {
      const response = await fetch("https://render.portalmicanva.com/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-Domain": domain
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        return new Response("Error al renderizar la página.", { status: 500 });
      }
      const html = await response.text();
      return new Response(html, { headers: { "Content-Type": "text/html" } });
    } catch (error) {
      return new Response("Error interno.", { status: 500 });
    }
  }

  // Para usuarios normales, se devuelve el contenido original
  return fetch(request);
}
