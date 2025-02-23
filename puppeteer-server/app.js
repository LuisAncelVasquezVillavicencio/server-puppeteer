const express = require('express');
const next = require('next');
const path = require('path');
const routes = require('./routes');

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

    const PORT = 8080;
    server.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
});
