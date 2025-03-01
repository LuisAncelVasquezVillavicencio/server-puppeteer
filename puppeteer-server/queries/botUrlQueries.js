/**
 * Análisis de URLs más visitadas por Bots
 *
 * Este módulo proporciona una función para analizar qué páginas son las más visitadas por los bots registrados
 * en la tabla "bot_requests". Esto permite responder a preguntas de negocio como:
 *
 * - ¿Qué páginas son accedidas con mayor frecuencia por los bots?
 * - ¿Están los bots indexando contenido importante o accediendo a áreas sensibles del sitio?
 * - ¿Cuáles son las Top 10 URLs visitadas por bots?
 *
 * Métrica posible:
 *   - Top 10 URLs más visitadas por bots (ejemplo: 1️⃣ /home → 500 visitas, 2️⃣ /producto/123 → 300 visitas, etc.)
 *
 * La función acepta parámetros de fecha (startDate y endDate) en formato ISO, lo que permite filtrar el análisis
 * por un rango temporal.
 */

const pool = require('../services/dbConfig'); 
/**
 * getTopVisitedURLs
 *
 * Esta función obtiene el top 10 de URLs más visitadas por bots en la tabla "bot_requests",
 * filtrando los registros según el rango de fechas proporcionado.
 *
 * A nivel de negocio, esta consulta permite:
 *   - Identificar las páginas con mayor tráfico automatizado.
 *   - Detectar si los bots están accediendo a áreas críticas o sensibles del sitio.
 *
 * @param {string} startDate - Fecha de inicio en formato ISO (ej: '2025-03-01T00:00:00Z')
 * @param {string} endDate - Fecha de fin en formato ISO (ej: '2025-03-02T00:00:00Z')
 * @returns {Promise<Array>} - Array de objetos con las propiedades:
 *    - url: La URL solicitada.
 *    - total: Número total de visitas registradas para esa URL.
 */
async function getTopVisitedURLs(startDate, endDate) {
  const query = `
    SELECT 
      url,
      COUNT(*) AS total
    FROM bot_requests
    WHERE timestamp BETWEEN $1 AND $2
    GROUP BY url
    ORDER BY total DESC
    LIMIT 10;
  `;
  try {
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  } catch (error) {
    console.error("❌ Error en getTopVisitedURLs:", error);
    throw error;
  }
}

module.exports = {
  getTopVisitedURLs,
};
