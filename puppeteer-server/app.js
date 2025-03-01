const express = require('express');
const next = require('next');
const path = require('path');
const routes = require('./routes');
const initializeSocket = require('./socket'); // Importa el módulo del socket
const apiRoutes = require('./api');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();



app.prepare().then(() => {
  const server = express();
  
  app.use(express.json());
  app.use('/api', apiRoutes);

  server.use((req, res, next) => {
    req.domain = req.hostname.replace(/^www\./, '');
    next();
  });

  server.use('/public', express.static(path.join(__dirname, 'public')));
  server.use('/', routes);
  
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  // Levanta el servidor HTTP en el puerto 8080
  const httpServer = server.listen(8080, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:8080`);
  });
  
  // Inicializa el WebSocket y la escucha de logs
  initializeSocket(httpServer);
});
