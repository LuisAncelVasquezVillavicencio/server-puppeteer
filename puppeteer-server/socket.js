const fs = require('fs');
const { WebSocketServer } = require('ws');
const { Tail } = require('tail');

function initializeSocket(httpServer) {
  // Crea el WebSocketServer en el mismo servidor HTTP en la ruta /ws
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Rutas de logs
  const startupLogPath = '/var/log/startup-script.log';
  const pm2LogPath = '/var/log/pm2/puppeteer-server.log'; 

  wss.on('connection', (ws, req) => {
    console.log('Cliente conectado para recibir logs');
    console.log('URL de conexión:', req.url);
    
    // Envía un mensaje de confirmación inicial
    ws.send(JSON.stringify({ type: 'info', message: 'Conexión WebSocket establecida' }));

    // Para el log de startup, como se escribe solo una vez, lo leemos al conectarse
    fs.readFile(startupLogPath, 'utf8', (err, data) => {
      if (!err) {
        ws.send(JSON.stringify({ type: 'startup', log: data }));
      } else {
        console.error('Error leyendo startup log:', err);
      }
    });

    ws.on('message', (message) => {
      console.log('Mensaje recibido:', message);
    });

    ws.on('close', () => {
      console.log('Cliente WebSocket desconectado');
    });
  });

  // Para el log de PM2, si sigue actualizándose, se puede seguir usando Tail
  const tailPm2 = new Tail(pm2LogPath);
  tailPm2.on('line', (data) => {
    //console.log('PM2 log:', data);
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: 'pm2', log: data }));
      }
    });
  });
  tailPm2.on('error', (error) => {
    console.error('Error leyendo PM2 log:', error);
  });

  return wss;
}

module.exports = initializeSocket;
