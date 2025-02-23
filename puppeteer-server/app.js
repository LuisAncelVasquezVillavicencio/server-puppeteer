const express = require('express');
const next = require('next');
const path = require('path');
const routes = require('./routes');
const { WebSocketServer } = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });  // Inicia Next.js en modo desarrollo o producción
const handle = app.getRequestHandler(); // Maneja las rutas de Next.js

app.prepare().then(() => {
    const server = express();

    // Middleware para identificar el dominio de la petición
    server.use((req, res, next) => {
        req.domain = req.hostname.replace(/^www\./, '');
        next();
    });

    // 📌 Hacer pública la carpeta /public
    server.use('/public', express.static(path.join(__dirname, 'public')));

    // 📌 Mantener tus rutas actuales en Express
    server.use('/', routes);

    // 📌 Redirigir todas las demás rutas a Next.js
    server.all('*', (req, res) => {
        return handle(req, res);
    });
    
    const httpServer = server.listen(8080, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:8080`);
    });
    
    // Configurar WebSocket Server
    const wss = new WebSocketServer({ server: httpServer });
    wss.on('connection', (ws) => {
        console.log('Cliente conectado para recibir logs');

        // Enviar logs de /var/log/startup-script.log
        const startupLogStream = fs.createReadStream('/var/log/startup-script.log', { encoding: 'utf8', start: 0 });
        startupLogStream.on('data', (chunk) => {
            ws.send(JSON.stringify({ type: 'startup', log: chunk }));
        });

        startupLogStream.on('error', (err) => {
            console.error('Error al leer startup log:', err);
        });

        // Enviar logs de /var/log/pm2/puppeteer-server.log en tiempo real
        const pm2LogStream = fs.createReadStream('/var/log/pm2/puppeteer-server.log', { encoding: 'utf8', start: 0 });
        pm2LogStream.on('data', (chunk) => {
            ws.send(JSON.stringify({ type: 'pm2', log: chunk }));
        });

        pm2LogStream.on('error', (err) => {
            console.error('Error al leer pm2 log:', err);
        });

        ws.on('close', () => {
            console.log('Cliente desconectado');
            startupLogStream.close();
            pm2LogStream.close();
        });
    });

    const PORT = 8080;
    server.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
});
