const fs = require('fs');
const { WebSocketServer } = require('ws');
const { Tail } = require('tail');

function initializeSocket(httpServer) {
  // Crea el WebSocketServer en el mismo servidor HTTP en la ruta /ws
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Rutas de logs
  const startupLogPath = '/var/log/startup-script.log';
  const pm2LogPath = '/home/deployer/.pm2/logs/puppeteer-server-out.log'; 
  const pm2LogErrorPath = '/home/deployer/.pm2/logs/puppeteer-server-error.log'; 
  
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

  // Tail para el log de PM2 (salida)
  const tailPm2 = new Tail(pm2LogPath);
  tailPm2.on('line', (data) => {
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: 'pm2', log: data }));
      }
    });
  });
  tailPm2.on('error', (error) => {
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: 'pm2Error', error: error.message }));
      }
    });
    console.error('Error leyendo PM2 error log:', error);
  });

  // Tail para el log de PM2 (errores)
  const tailPm2Error = new Tail(pm2LogErrorPath);
  tailPm2Error.on('line', (data) => {
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: 'pm2', log: data }));
      }
    });
  });
  tailPm2Error.on('error', (error) => {
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: 'pm2Error', error: error.message }));
      }
    });
    console.error('Error leyendo PM2 error log:', error);
  });

  return wss;
}

module.exports = initializeSocket;
