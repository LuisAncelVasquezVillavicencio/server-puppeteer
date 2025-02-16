const puppeteer = require('puppeteer');

async function renderizarPagina(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process'],
            headless: 'new',
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)');

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        const content = await page.content();
        return content;

    } catch (error) {
        throw new Error(`Error en Puppeteer: ${error.message}`);
    } finally {
        if (browser) await browser.close();
    }
}

module.exports = { renderizarPagina };
