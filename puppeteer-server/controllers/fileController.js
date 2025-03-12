const fs = require('fs');
const path = require('path');

const BASE_PATH = path.join(__dirname, '../public');

const fileController = {
  getFile: async (req, res) => {
    const { domain, fileType } = req.params;
    const filePath = path.join(BASE_PATH, domain, fileType);

    try {
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Archivo no encontrado' });
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      res.send(content);
    } catch (error) {
      console.error('Error al leer archivo:', error);
      res.status(500).json({ error: 'Error al leer archivo' });
    }
  },

  saveFile: async (req, res) => {
    const { domain, fileType } = req.params;
    const { content } = req.body;
    const domainPath = path.join(BASE_PATH, domain);
    const filePath = path.join(domainPath, fileType);

    try {
      if (!fs.existsSync(domainPath)) {
        fs.mkdirSync(domainPath, { recursive: true });
      }

      fs.writeFileSync(filePath, content, 'utf-8');
      res.json({ message: 'Archivo guardado exitosamente' });
    } catch (error) {
      console.error('Error al guardar archivo:', error);
      res.status(500).json({ error: 'Error al guardar archivo' });
    }
  }
};

module.exports = fileController;