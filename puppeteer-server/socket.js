const { WebSocketServer } = require('ws');
const { Tail } = require('tail');

function initializeSocket(httpServer) {
  // Crea el WebSocketServer en el mismo servidor HTTP en la ruta /ws
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

  // Rutas de logs
  const startupLogPath = '/var/log/startup-script.log';
  const pm2LogPath = '/var/log/pm2/puppeteer-server.log'; 

  // Buffers para acumular las líneas de log
  let startupBuffer = "";
  let pm2Buffer = "";

  // Función para enviar los logs acumulados a todos los clientes
  const sendLogs = () => {
    if (startupBuffer) {
      wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ type: 'startup', log: startupBuffer }));
        }
      });
      startupBuffer = ""; // Limpiar el buffer una vez enviado
    }
    if (pm2Buffer) {
      wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ type: 'pm2', log: pm2Buffer }));
        }
      });
      pm2Buffer = "";
    }
  };

  // Configurar la lectura de logs usando Tail
  const tailStartup = new Tail(startupLogPath);
  tailStartup.on('line', (data) => {
    console.log('Startup log:', data);
    startupBuffer += data + "\n"; // Acumula cada nueva línea
  });
  tailStartup.on('error', (error) => {
    console.error('Error leyendo startup log:', error);
  });

  const tailPm2 = new Tail(pm2LogPath);
  tailPm2.on('line', (data) => {
    console.log('PM2 log:', data);
    pm2Buffer += data + "\n";
  });
  tailPm2.on('error', (error) => {
    console.error('Error leyendo PM2 log:', error);
  });

  // Envía los logs acumulados cada minuto (60000 ms)
  setInterval(sendLogs, 60000);

  return wss;
}

module.exports = initializeSocket;
