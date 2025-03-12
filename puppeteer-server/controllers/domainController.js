const fs = require('fs');
const path = require('path');

const getDomains = (req, res) => {
  try {
    // Cambiar la ruta para buscar en la carpeta public
    const domainsPath = path.join(__dirname, '..', 'public');
    
    console.log('Buscando dominios en:', domainsPath);
    
    // Verificar si el directorio existe
    if (!fs.existsSync(domainsPath)) {
      console.log('El directorio public no existe:', domainsPath);
      return res.json([]);
    }
    
    // Leer los directorios dentro de public
    const domains = fs.readdirSync(domainsPath)
      .filter(file => {
        const fullPath = path.join(domainsPath, file);
        return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
      });
    
    console.log('Dominios encontrados:', domains);
    res.json(domains);
  } catch (error) {
    console.error('Error al leer dominios:', error);
    res.status(500).json({ error: 'Error reading domains' });
  }
};

module.exports = {
  getDomains
};