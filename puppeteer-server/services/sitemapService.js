const fs = require('fs');
const path = require('path');

const BASE_PATH = path.join(__dirname, '../public'); // Directorio raíz donde se almacenan los sitemaps

function actualizarSitemap(dominio, nuevaURL) {
    const dominioPath = path.join(BASE_PATH, dominio);

    // 📌 Si la carpeta del dominio no existe, la creamos
    if (!fs.existsSync(dominioPath)) {
        fs.mkdirSync(dominioPath, { recursive: true });
    }

    const sitemapPath = path.join(dominioPath, 'sitemap.xml');
    let urls = [];

    if (fs.existsSync(sitemapPath)) {
        const data = fs.readFileSync(sitemapPath, 'utf8');
        urls = data.match(/<loc>(.*?)<\/loc>/g)?.map(loc => loc.replace(/<\/?loc>/g, '')) || [];
    }

    // 📌 Agregar nueva URL si no está en el sitemap
    if (!urls.includes(nuevaURL)) {
        urls.push(nuevaURL);
        fs.writeFileSync(sitemapPath, generarSitemap(urls));
        console.log(`✅ Sitemap actualizado para ${dominio}: ${nuevaURL}`);
    }
}

function generarSitemap(urls) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls.map(url => `<url><loc>${url}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`).join('')}
    </urlset>`;
}

module.exports = { actualizarSitemap, generarSitemap };
