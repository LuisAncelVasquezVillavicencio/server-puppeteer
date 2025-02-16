const { renderizarPagina } = require('../services/puppeteerService');

async function renderHandler(req, res) {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('Falta el parámetro URL.');
    }

    try {
        const content = await renderizarPagina(url);
        res.status(200).send(content);
    } catch (error) {
        console.error('Error en render:', error.message);
        res.status(500).send(`Error al renderizar la página: ${error.message}`);
    }
}

module.exports = { renderHandler };
