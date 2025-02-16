const fs = require('fs');
const path = require('path');
const { SITEMAP_DIR } = require('../config');

function actualizarSitemap(dominio, nuevaURL) {
    const sitemapPath = path.join(SITEMAP_DIR, `${dominio}_sitemap.xml`);

    let urls = [];
    if (fs.existsSync(sitemapPath)) {
        const data = fs.readFileSync(sitemapPath, 'utf8');
        urls = data.match(/<loc>(.*?)<\/loc>/g)?.map(loc => loc.replace(/<\/?loc>/g, '')) || [];
    }

    if (!urls.includes(nuevaURL)) {
        urls.push(nuevaURL);
        fs.writeFileSync(sitemapPath, generarSitemap(urls));
        console.log(`Sitemap actualizado para ${dominio}: ${nuevaURL}`);
    }
}

function generarSitemap(urls) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls.map(url => `<url><loc>${url}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`).join('')}
    </urlset>`;
}

module.exports = { actualizarSitemap, generarSitemap };
