const fs = require('fs');
const path = require('path');
const { SITEMAP_DIR } = require('../config');

function sitemapHandler(req, res) {
    const dominio = req.hostname.replace(/^www\./, '');
    const sitemapPath = path.join(SITEMAP_DIR, `${dominio}_sitemap.xml`);

    if (fs.existsSync(sitemapPath)) {
        res.header('Content-Type', 'application/xml');
        fs.createReadStream(sitemapPath).pipe(res);
    } else {
        res.status(404).send('Sitemap no encontrado');
    }
}

module.exports = { sitemapHandler };
