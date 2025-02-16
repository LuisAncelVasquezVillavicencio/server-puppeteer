const { renderizarPagina } = require('../services/puppeteerService');
const { actualizarSitemap } = require('../services/sitemapService');

async function renderHandler(req, res) {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('Falta el parámetro URL.');
    }

    try {
        // Renderizar la página con Puppeteer
        const content = await renderizarPagina(url);

        // Extraer el dominio de la URL para actualizar su sitemap
        const urlObj = new URL(url);
        const dominio = urlObj.hostname.replace(/^www\./, '');

        // 📌 Actualizar el sitemap automáticamente en `/public/[dominio]/sitemap.xml`
        actualizarSitemap(dominio, url);

        res.status(200).send(content);
    } catch (error) {
        console.error('❌ Error en render:', error.message);
        res.status(500).send(`Error al renderizar la página: ${error.message}`);
    }
}

module.exports = { renderHandler };
