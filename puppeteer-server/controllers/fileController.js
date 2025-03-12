const fs = require('fs');
const path = require('path');

const getFile = (req, res) => {
  const { domain, fileType } = req.params;
  
  try {
    const publicPath = path.join(__dirname, '..', 'public');
    const domainPath = path.join(publicPath, domain);
    
    let filePath;
    if (fileType === 'sitemap') {
      filePath = path.join(domainPath, 'sitemap.xml');
    } else if (fileType === 'root') {
      filePath = path.join(domainPath, 'root.txt');
    } else {
      return res.status(400).json({ error: 'Invalid file type' });
    }
    
    // Check if file exists, if not create empty file
    if (!fs.existsSync(filePath)) {
      // Ensure domain directory exists
      if (!fs.existsSync(domainPath)) {
        fs.mkdirSync(domainPath, { recursive: true });
      }
      
      // Create empty file with default content
      const defaultContent = fileType === 'sitemap' 
        ? '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>'
        : '# robots.txt\nUser-agent: *\nAllow: /';
      
      fs.writeFileSync(filePath, defaultContent);
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ content });
  } catch (error) {
    console.error(`Error reading file for ${domain}:`, error);
    res.status(500).json({ error: 'Error reading file' });
  }
};

const saveFile = (req, res) => {
  const { domain, fileType } = req.params;
  const { content } = req.body;
  
  try {
    const publicPath = path.join(__dirname, '..', 'public');
    const domainPath = path.join(publicPath, domain);
    
    // Ensure domain directory exists
    if (!fs.existsSync(domainPath)) {
      fs.mkdirSync(domainPath, { recursive: true });
    }
    
    let filePath;
    if (fileType === 'sitemap') {
      filePath = path.join(domainPath, 'sitemap.xml');
    } else if (fileType === 'root') {
      filePath = path.join(domainPath, 'root.txt');
    } else {
      return res.status(400).json({ error: 'Invalid file type' });
    }
    
    fs.writeFileSync(filePath, content);
    res.json({ success: true });
  } catch (error) {
    console.error(`Error saving file for ${domain}:`, error);
    res.status(500).json({ error: 'Error saving file' });
  }
};

module.exports = {
  getFile,
  saveFile
};