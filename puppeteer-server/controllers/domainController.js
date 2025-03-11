const fs = require('fs');
const path = require('path');

const getDomains = (req, res) => {
  try {
    const domainsPath = path.join(__dirname, '..', 'domains');
    const domains = fs.readdirSync(domainsPath)
      .filter(file => fs.statSync(path.join(domainsPath, file)).isDirectory());
    
    res.json(domains);
  } catch (error) {
    console.error('Error reading domains:', error);
    res.status(500).json({ error: 'Error reading domains' });
  }
};

module.exports = {
  getDomains
};