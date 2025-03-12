import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const basePath = path.join(process.cwd(), 'domains');
    const domains = fs.readdirSync(basePath)
      .filter(file => fs.statSync(path.join(basePath, file)).isDirectory());

    res.status(200).json(domains);
  } catch (error) {
    console.error('Error reading domains:', error);
    res.status(500).json({ message: 'Error reading domains' });
  }
}