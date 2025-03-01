/**
 * Indicadores de Actividad de Bots
 *
 * Este módulo provee funciones para obtener indicadores clave (KPIs) a partir de la tabla "bot_requests".
 * Los indicadores permiten analizar la actividad de bots, comparar períodos (p.ej. mes actual vs. mes anterior) y
 * tomar decisiones estratégicas en temas de seguridad, SEO y optimización de recursos.
 *
 * Indicadores incluidos:
 *   1. Total Bot Requests
 *      - Total de solicitudes registradas.
 *      - Comparación con un período anterior para medir variación.
 *
 *   2. URLs Únicas
 *      - Número de URLs distintas visitadas por bots.
 *      - Comparación con el período anterior.
 *
 *   3. % Errores
 *      - Porcentaje de solicitudes que generaron error.
 *      - Comparación con el período anterior.
 *
 *   4. Bot Más Activo
 *      - Identifica la IP (o bot) que realizó el mayor número de solicitudes en el período.
 *
 * Cada función acepta (opcionalmente) parámetros de fecha:
 *   - currentStart, currentEnd: Rango de fechas para el período actual (en formato ISO, ej: '2025-03-01T00:00:00Z').
 *   - prevStart, prevEnd: Rango para el período anterior (opcional) para poder calcular comparaciones.
 *
 * Si no se pasan fechas, se utiliza toda la data disponible.
 */

const pool = require('../services/dbConfig'); 
/**
 * getTotalBotRequests
 *
 * Retorna el total de solicitudes de bots para el período actual y, si se proporcionan, también el total del período anterior
 * para calcular la variación porcentual.
 *
 * @param {string|null} currentStart - Fecha de inicio del período actual (ISO) o null para total.
 * @param {string|null} currentEnd - Fecha de fin del período actual (ISO).
 * @param {string|null} prevStart - Fecha de inicio del período anterior (ISO) (opcional).
 * @param {string|null} prevEnd - Fecha de fin del período anterior (ISO) (opcional).
 * @returns {Promise<Object>} Objeto { current, previous, percentageChange }
 */
async function getTotalBotRequests(currentStart, currentEnd, prevStart, prevEnd) {
  let currentQuery = '';
  let currentParams = [];
  if (currentStart && currentEnd) {
    currentQuery = 'SELECT COUNT(*) as total FROM bot_requests WHERE timestamp BETWEEN $1 AND $2';
    currentParams = [currentStart, currentEnd];
  } else {
    currentQuery = 'SELECT COUNT(*) as total FROM bot_requests';
  }
  const currentResult = await pool.query(currentQuery, currentParams);
  const currentTotal = parseInt(currentResult.rows[0].total, 10);

  let previousTotal = null;
  if (prevStart && prevEnd) {
    const prevQuery = 'SELECT COUNT(*) as total FROM bot_requests WHERE timestamp BETWEEN $1 AND $2';
    const prevParams = [prevStart, prevEnd];
    const prevResult = await pool.query(prevQuery, prevParams);
    previousTotal = parseInt(prevResult.rows[0].total, 10);
  }

  let percentageChange = null;
  if (previousTotal !== null && previousTotal !== 0) {
    percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
  }

  return { current: currentTotal, previous: previousTotal, percentageChange };
}

/**
 * getUniqueURLs
 *
 * Cuenta las URLs únicas accedidas por bots en el período actual y, si se proporcionan, en el período anterior.
 *
 * @param {string|null} currentStart - Fecha de inicio del período actual (ISO) o null para total.
 * @param {string|null} currentEnd - Fecha de fin del período actual (ISO).
 * @param {string|null} prevStart - Fecha de inicio del período anterior (ISO) (opcional).
 * @param {string|null} prevEnd - Fecha de fin del período anterior (ISO) (opcional).
 * @returns {Promise<Object>} Objeto { current, previous, percentageChange }
 */
async function getUniqueURLs(currentStart, currentEnd, prevStart, prevEnd) {
  let currentQuery = '';
  let currentParams = [];
  if (currentStart && currentEnd) {
    currentQuery = 'SELECT COUNT(DISTINCT url) as unique_urls FROM bot_requests WHERE timestamp BETWEEN $1 AND $2';
    currentParams = [currentStart, currentEnd];
  } else {
    currentQuery = 'SELECT COUNT(DISTINCT url) as unique_urls FROM bot_requests';
  }
  const currentResult = await pool.query(currentQuery, currentParams);
  const currentUnique = parseInt(currentResult.rows[0].unique_urls, 10);

  let previousUnique = null;
  if (prevStart && prevEnd) {
    const prevQuery = 'SELECT COUNT(DISTINCT url) as unique_urls FROM bot_requests WHERE timestamp BETWEEN $1 AND $2';
    const prevParams = [prevStart, prevEnd];
    const prevResult = await pool.query(prevQuery, prevParams);
    previousUnique = parseInt(prevResult.rows[0].unique_urls, 10);
  }

  let percentageChange = null;
  if (previousUnique !== null && previousUnique !== 0) {
    percentageChange = ((currentUnique - previousUnique) / previousUnique) * 100;
  }

  return { current: currentUnique, previous: previousUnique, percentageChange };
}

/**
 * getPercentageErrors
 *
 * Calcula el porcentaje de solicitudes que generaron error (campo error no nulo) en el período actual y opcionalmente,
 * compara con el período anterior.
 *
 * @param {string|null} currentStart - Fecha de inicio del período actual (ISO) o null para total.
 * @param {string|null} currentEnd - Fecha de fin del período actual (ISO).
 * @param {string|null} prevStart - Fecha de inicio del período anterior (ISO) (opcional).
 * @param {string|null} prevEnd - Fecha de fin del período anterior (ISO) (opcional).
 * @returns {Promise<Object>} Objeto { current, previous, percentageChange } donde current y previous son porcentajes.
 */
async function getPercentageErrors(currentStart, currentEnd, prevStart, prevEnd) {
  let currentErrorQuery = '';
  let currentTotalQuery = '';
  let currentParams = [];
  if (currentStart && currentEnd) {
    currentErrorQuery = 'SELECT COUNT(*) as error_count FROM bot_requests WHERE error IS NOT NULL AND timestamp BETWEEN $1 AND $2';
    currentTotalQuery = 'SELECT COUNT(*) as total FROM bot_requests WHERE timestamp BETWEEN $1 AND $2';
    currentParams = [currentStart, currentEnd];
  } else {
    currentErrorQuery = 'SELECT COUNT(*) as error_count FROM bot_requests WHERE error IS NOT NULL';
    currentTotalQuery = 'SELECT COUNT(*) as total FROM bot_requests';
  }
  const currentErrorResult = await pool.query(currentErrorQuery, currentParams);
  const currentTotalResult = await pool.query(currentTotalQuery, currentParams);
  const currentErrorCount = parseInt(currentErrorResult.rows[0].error_count, 10);
  const currentTotal = parseInt(currentTotalResult.rows[0].total, 10);
  const currentPercentage = currentTotal ? (currentErrorCount * 100.0 / currentTotal) : 0;

  let previousPercentage = null;
  if (prevStart && prevEnd) {
    const prevErrorQuery = 'SELECT COUNT(*) as error_count FROM bot_requests WHERE error IS NOT NULL AND timestamp BETWEEN $1 AND $2';
    const prevTotalQuery = 'SELECT COUNT(*) as total FROM bot_requests WHERE timestamp BETWEEN $1 AND $2';
    const prevParams = [prevStart, prevEnd];
    const prevErrorResult = await pool.query(prevErrorQuery, prevParams);
    const prevTotalResult = await pool.query(prevTotalQuery, prevParams);
    const prevErrorCount = parseInt(prevErrorResult.rows[0].error_count, 10);
    const prevTotal = parseInt(prevTotalResult.rows[0].total, 10);
    previousPercentage = prevTotal ? (prevErrorCount * 100.0 / prevTotal) : 0;
  }

  let percentageChange = null;
  if (previousPercentage !== null && previousPercentage !== 0) {
    percentageChange = ((currentPercentage - previousPercentage) / previousPercentage) * 100;
  }

  return { current: currentPercentage, previous: previousPercentage, percentageChange };
}

/**
 * getMostActiveBot
 *
 * Identifica la IP (bot) con mayor número de solicitudes en el período actual.
 *
 * @param {string|null} currentStart - Fecha de inicio del período actual (ISO) o null para total.
 * @param {string|null} currentEnd - Fecha de fin del período actual (ISO).
 * @returns {Promise<Object>} Objeto con { ip, total_requests } del bot más activo.
 */
async function getMostActiveBot(currentStart, currentEnd) {
  let query = '';
  let params = [];
  if (currentStart && currentEnd) {
    query = `SELECT ip, COUNT(*) AS total_requests 
             FROM bot_requests 
             WHERE ip IS NOT NULL AND timestamp BETWEEN $1 AND $2 
             GROUP BY ip 
             ORDER BY total_requests DESC 
             LIMIT 1;`;
    params = [currentStart, currentEnd];
  } else {
    query = `SELECT ip, COUNT(*) AS total_requests 
             FROM bot_requests 
             WHERE ip IS NOT NULL 
             GROUP BY ip 
             ORDER BY total_requests DESC 
             LIMIT 1;`;
  }
  const result = await pool.query(query, params);
  return result.rows[0] || null;
}

module.exports = {
  getTotalBotRequests,
  getUniqueURLs,
  getPercentageErrors,
  getMostActiveBot,
};
