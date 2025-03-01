const { renderizarPagina } = require('../services/puppeteerService');
const { actualizarSitemap } = require('../services/sitemapService');
const { getCache, setCache } = require('../services/cacheService');
const { saveRequestData } = require('../services/dbService'); // Nuevo servicio para PostgreSQL

async function renderHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Método no permitido. Usa POST.');
    }

    let requestData;
    try {
        requestData = req.body;
    } catch (error) {
        return res.status(400).send('JSON inválido');
    }
    console.log("requestData:",requestData);
    const url = requestData.url;
    if (!url) {
        return res.status(400).send('Falta el parámetro URL en requestData.');
    }

    const cacheKey = `page:${url}`;
    try {
        // Verificar en caché
        const cachedHtml = await getCache(cacheKey);
        if (cachedHtml) {
            console.log('✅ Contenido obtenido de caché');
            // Medir tiempo de obtención desde caché
            requestData.renderTime = 0; // Indica que proviene de caché
            // Procesar requestData en segundo plano sin afectar la respuesta
            setImmediate(() => saveRequestData(requestData));
            return res.status(200).send(cachedHtml);
        }

        // Medir tiempo de renderizado
        const startTime = Date.now();
        const content = await renderizarPagina(url);
        const renderTime = Date.now() - startTime;

        // Agregar tiempo de renderizado a requestData
        requestData.renderTime = renderTime;

        // Extraer dominio de la URL para actualizar su sitemap
        const urlObj = new URL(url);
        const dominio = urlObj.hostname.replace(/^www\./, '');
        actualizarSitemap(dominio, url);

        // Guardar en caché para futuras peticiones
        await setCache(cacheKey, content);

        // Procesar requestData en segundo plano sin afectar la respuesta
        setImmediate(() => saveRequestData(requestData));
        
        res.status(200).send(content);
    } catch (error) {
        console.error('❌ Error en render:', error.message);

        // Agregar error a requestData y guardarlo en PostgreSQL
        requestData.error = error.message;
        setImmediate(() => saveRequestData(requestData));
        
        res.status(500).send(`Error al renderizar la página: ${error.message}`);
    }
}

module.exports = { renderHandler };
