const { renderizarPagina } = require('../services/puppeteerService');
const { actualizarSitemap } = require('../services/sitemapService');
const { getCache, setCache } = require('../services/cacheService');

async function renderHandler(req, res) {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('Falta el parámetro URL.');
    }

    const cacheKey = `page:${url}`;


    try {
        // Verificar en caché
        const cachedHtml = await getCache(cacheKey);
        if (cachedHtml) {
            console.log('✅ Contenido obtenido de caché');
            return res.status(200).send(cachedHtml);
        }

        // Renderizar la página con Puppeteer
        const content = await renderizarPagina(url);

        // Extraer el dominio de la URL para actualizar su sitemap
        const urlObj = new URL(url);
        const dominio = urlObj.hostname.replace(/^www\./, '');
        // 📌 Actualizar el sitemap automáticamente en `/public/[dominio]/sitemap.xml`
        actualizarSitemap(dominio, url);

        // Guardar el contenido en caché para futuras peticiones
        await setCache(cacheKey, content);

        res.status(200).send(content);
    } catch (error) {
        console.error('❌ Error en render:', error.message);
        res.status(500).send(`Error al renderizar la página: ${error.message}`);
    }
}

module.exports = { renderHandler };
