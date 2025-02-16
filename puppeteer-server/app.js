const express = require('express');
const routes = require('./routes');

const app = express();

// Middleware para identificar el dominio de la petición
app.use((req, res, next) => {
    req.domain = req.hostname.replace(/^www\./, '');
    next();
});

app.use('/', routes);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
