const { saveRequestData } = require('../queries/dbService');

async function logRequestHandler(req, res) {
    try {
        const requestData = req.body;
        
        // Validación básica
        if (!requestData || !requestData.url) {
            return res.status(400).json({ error: 'Datos de solicitud inválidos' });
        }

        // Procesar los datos en segundo plano
        setImmediate(() => saveRequestData(requestData));
        
        res.status(200).json({ message: 'Datos de solicitud registrados correctamente' });
    } catch (error) {
        console.error('❌ Error en logRequestHandler:', error);
        res.status(500).json({ error: 'Error al procesar los datos de la solicitud' });
    }
}

module.exports = {
    logRequestHandler
};