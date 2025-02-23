const express = require('express');
const next = require('next');
const path = require('path');
const routes = require('./routes');
const { WebSocketServer } = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });  
const handle = app.getRequestHandler(); 

app.prepare().then(() => {
    const server = express();

    server.use((req, res, next) => {
        req.domain = req.hostname.replace(/^www\./, '');
        next();
    });

    server.use('/public', express.static(path.join(__dirname, 'public')));

    server.use('/', routes);

    server.all('*', (req, res) => {
        return handle(req, res);
    });
    
    const httpServer = server.listen(8080, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:8080`);
    });
    
    // Configurar WebSocket en el mismo servidor Express
    const wss = new WebSocketServer({ server: httpServer , path: '/ws' });
    wss.on('connection', (ws, req) => {
        console.log('Cliente conectado para recibir logs');
        console.log('URL de conexión:', req.url);
        
        ws.send(JSON.stringify({ type: 'info', message: 'Conexión WebSocket establecida' }));

        ws.on('message', (message) => {
            console.log('Mensaje recibido:', message);
        });

        ws.on('close', () => {
            console.log('Cliente WebSocket desconectado');
        });
    });
});
