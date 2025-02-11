const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/render', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('Falta el parámetro URL.');
    }

    let browser;
    console.time('Tiempo total de renderizado');
    try {
        browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--single-process',
            ],
            headless: 'new' // (opcional) Puppeteer 19+ usa headless: 'new' para un modo headless más reciente
        });

        console.time('Tiempo de inicio del navegador');
        const page = await browser.newPage();
        console.timeEnd('Tiempo de inicio del navegador');

        await page.setViewport({ width: 1280, height: 720 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)');

        // Bloquear recursos innecesarios si lo deseas
        await page.setRequestInterception(true);
        page.on('request', (reqIntercept) => {
            const blockResources = []; // agrega "image", "font", etc. si quieres bloquear
            if (blockResources.includes(reqIntercept.resourceType())) {
                reqIntercept.abort();
            } else {
                reqIntercept.continue();
            }
        });

        console.time('Tiempo de navegación de la página');
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        console.timeEnd('Tiempo de navegación de la página');

        console.time('Tiempo de extracción de contenido');
        const content = await page.content();
        console.timeEnd('Tiempo de extracción de contenido');

        console.timeEnd('Tiempo total de renderizado');
        res.status(200).send(content);
    } catch (error) {
        console.error('Error durante el renderizado:', error.message);
        // No llamamos console.timeEnd aquí porque si no se iniciaron todos los tiempos puede fallar.
        res.status(500).send(`Error al renderizar la página: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

const PORT = 80;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});