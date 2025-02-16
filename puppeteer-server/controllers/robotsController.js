const fs = require('fs');
const path = require('path');

const BASE_PATH = path.join(__dirname, '../public'); // Directorio raíz donde se almacenan los archivos

function getDomain(req) {
    return req.hostname.replace(/^www\./, ''); // Eliminar 'www.'
}

function serveFile(req, res, filename, defaultContent = '') {
    const domain = getDomain(req);
    const filePath = path.join(BASE_PATH, domain, filename);

    if (fs.existsSync(filePath)) {
        console.log(`✅ Sirviendo ${filename} para ${domain}`);
        res.sendFile(filePath);
    } else {
        console.log(`⚠️ ${filename} no encontrado para ${domain}, devolviendo contenido por defecto.`);
        res.status(404).send(defaultContent);
    }
}

// 📌 Servir robots.txt
function robotsHandler(req, res) {
    serveFile(req, res, 'robots.txt', 'User-agent: *\nDisallow:');
}

// 📌 Servir sitemap.xml
function sitemapHandler(req, res) {
    serveFile(req, res, 'sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>');
}

module.exports = { robotsHandler, sitemapHandler };
