const fs = require('fs');
const path = require('path');
const { ROBOTS_DIR } = require('../config');

function robotsHandler(req, res) {
    const dominio = req.hostname.replace(/^www\./, '');
    const robotsPath = path.join(ROBOTS_DIR, `${dominio}_robots.txt`);

    if (fs.existsSync(robotsPath)) {
        res.header('Content-Type', 'text/plain');
        fs.createReadStream(robotsPath).pipe(res);
    } else {
        res.status(404).send('Robots.txt no encontrado');
    }
}

module.exports = { robotsHandler };
