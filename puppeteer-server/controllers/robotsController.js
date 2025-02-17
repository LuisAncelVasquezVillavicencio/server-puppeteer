const fs = require('fs');
const path = require('path');

const BASE_PATH = path.join(__dirname, '../public'); // Directorio raíz donde se almacenan los archivos

function getDomain(req) {
    return req.hostname.replace(/^www\./, ''); // Eliminar 'www.'
}

function generateFileIfNotExists(domain, filename, defaultContent) {
    const filePath = path.join(BASE_PATH, domain, filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`📌 Generando ${filename} para ${domain}`);

        // Crear la carpeta si no existe
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        // Guardar el archivo con el contenido por defecto
        fs.writeFileSync(filePath, defaultContent);
    }
}

function serveFile(req, res, filename, defaultContent) {
    const domain = getDomain(req);
    const filePath = path.join(BASE_PATH, domain, filename);

    // 📌 Si el archivo no existe, generarlo antes de servirlo
    generateFileIfNotExists(domain, filename, defaultContent);

    if (fs.existsSync(filePath)) {
        console.log(`✅ Sirviendo ${filename} para ${domain}`);
        res.sendFile(filePath);
    } else {
        console.log(`⚠️ ${filename} no encontrado para ${domain}`);
        res.status(404).send(`Archivo no encontrado: ${filename}`);
    }
}

// 📌 Servir robots.txt con Sitemap incluido
function robotsHandler(req, res) {
    const domain = getDomain(req);
    const robotsContent = `User-agent: *\nAllow: /\nSitemap: https://${domain}/sitemap.xml\n`;
    serveFile(req, res, 'robots.txt', robotsContent);
}

// 📌 Servir sitemap.xml (vacío por defecto)
function sitemapHandler(req, res) {
    serveFile(req, res, 'sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>');
}

module.exports = { robotsHandler, sitemapHandler };
