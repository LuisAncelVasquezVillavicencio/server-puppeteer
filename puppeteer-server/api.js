
const express = require('express');
const router = express.Router();
const {
  getTotalBotRequests,
  getUniqueURLs,
  getPercentageErrors,
  getMostActiveBot,
} = require('./queries/botIndicatorsQueries');
const {
  getBotDistributionByType,
  getBotDistributionByCategory,
} = require('./queries/botAnalyticsQueries');
const {
  getBotConnectionTypeDistribution,
} = require('./queries/botConnectionQueries');
const {
  getBotGeoDistribution,
} = require('./queries/botGeoQueries');
const { 
  getBotActivityStats
} = require('./queries/botRequestsService');
const { logRequestHandler } = require('./controllers/requestLogController');
const { getLatestRequests } = require('./queries/requestQueries');
const { getMostVisitedUrls } = require('./queries/botUrlQueries');
const fileController = require('./controllers/fileController');
const { getDomains } = require('./controllers/domainController');

// Endpoint para obtener el total de solicitudes de bots
router.get('/total-bot-requests', async (req, res) => {
  const { currentStart, currentEnd, prevStart, prevEnd } = req.query;
  try {
    const result = await getTotalBotRequests(currentStart, currentEnd, prevStart, prevEnd);
    res.json(result);
  } catch (error) {
    console.error('Error en /total-bot-requests:', error);
    res.status(500).json({ error: 'Error al obtener total de solicitudes de bots' });
  }
});

// Endpoint para obtener la distribución de bots por tipo
router.get('/bot-distribution-by-type', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await getBotDistributionByType(startDate, endDate);
    res.json(result);
  } catch (error) {
    console.error('Error en /bot-distribution-by-type:', error);
    res.status(500).json({ error: 'Error al obtener distribución de bots por tipo' });
  }
});

// Endpoint para obtener la distribución de bots por categoría
router.get('/bot-distribution-by-category', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await getBotDistributionByCategory(startDate, endDate);
    res.json(result);
  } catch (error) {
    console.error('Error en /bot-distribution-by-category:', error);
    res.status(500).json({ error: 'Error al obtener distribución de bots por categoría' });
  }
});

// Endpoint para obtener la distribución de tipos de conexión de bots
router.get('/bot-connection-type-distribution', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await getBotConnectionTypeDistribution(startDate, endDate);
    res.json(result);
  } catch (error) {
    console.error('Error en /bot-connection-type-distribution:', error);
    res.status(500).json({ error: 'Error al obtener distribución de tipos de conexión de bots' });
  }
});

// Endpoint para obtener la distribución geográfica de bots
// ... existing code ...


router.get('/bot-geo-distribution', async (req, res) => {
  const { startDate, endDate, isBot } = req.query;
  try {
    // Convert isBot string to boolean
    const isBotBool = isBot === 'true';
    const result = await getBotGeoDistribution(startDate, endDate, isBotBool);
    res.json(result);
  } catch (error) {
    console.error('Error en /bot-geo-distribution:', error);
    res.status(500).json({ error: 'Error al obtener distribución geográfica de bots' });
  }
});

// Endpoint para obtener URLs únicas
router.get('/unique-urls', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await getUniqueURLs(startDate, endDate);
    res.json(result);
  } catch (error) {
    console.error('Error en /unique-urls:', error);
    res.status(500).json({ error: 'Error al obtener URLs únicas' });
  }
});

// Endpoint para obtener el porcentaje de errores
router.get('/percentage-errors', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await getPercentageErrors(startDate, endDate);
    res.json(result);
  } catch (error) {
    console.error('Error en /percentage-errors:', error);
    res.status(500).json({ error: 'Error al obtener porcentaje de errores' });
  }
});

// Endpoint para obtener el bot más activo
router.get('/most-active-bot', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await getMostActiveBot(startDate, endDate);
    res.json(result);
  } catch (error) {
    console.error('Error en /most-active-bot:', error);
    res.status(500).json({ error: 'Error al obtener el bot más activo' });
  }
});

router.get('/bot-activity', async (req, res) => {
  try {
    // Extraer fechas desde query params, si se requiere
    const { startDate, endDate } = req.query;

    // Llama a tu método en la capa de servicios
    const data = await getBotActivityStats(startDate, endDate);
    res.json(data);
  } catch (error) {
    console.error('Error al obtener actividad de bots:', error);
    res.status(500).json({ error: 'Error al obtener actividad de bots' });
  }
});

// Agregar esta nueva ruta
router.post('/log-request', logRequestHandler);

router.get('/domains', getDomains);

router.get('/latest-requests', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  try {
    const result = await getLatestRequests({
      page: parseInt(page),
      limit: parseInt(limit),
      search
    });
    res.json(result);
  } catch (error) {
    console.error('Error in /latest-requests:', error);
    res.status(500).json({ error: 'Error fetching latest requests' });
  }
});

router.get('/most-visited-urls', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const urls = await getMostVisitedUrls(startDate, endDate);
    res.json(urls);
  } catch (error) {
    console.error('Error fetching most visited URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/files/:domain/:fileType', fileController.getFile);
router.post('/files/:domain/:fileType', fileController.saveFile);



module.exports = router;