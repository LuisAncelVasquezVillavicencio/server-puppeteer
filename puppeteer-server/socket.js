const { WebSocketServer } = require('ws');
const { Tail } = require('tail');

function initializeSocket(httpServer) {
  // Crea el WebSocketServer en el mismo servidor HTTP con la ruta /ws
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
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

  // Configurar la lectura de logs usando Tail
  const startupLogPath = '/var/log/startup-script.log';
  const pm2LogPath = '/var/log/pm2/puppeteer-server.log';

  // Tail para el log del script de inicio
  const tailStartup = new Tail(startupLogPath);
  tailStartup.on('line', (data) => {
    console.log('Startup log:', data);
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: 'startup', log: data + "\n" }));
      }
    });
  });
  tailStartup.on('error', (error) => {
    console.error('Error leyendo startup log:', error);
  });

  // Tail para el log de PM2 
  const tailPm2 = new Tail(pm2LogPath);
  tailPm2.on('line', (data) => {
    console.log('PM2 log:', data);
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: 'pm2', log: data + "\n" }));
      }
    });
  });
  tailPm2.on('error', (error) => {
    console.error('Error leyendo PM2 log:', error);
  });

  return wss;
}

module.exports = initializeSocket;
