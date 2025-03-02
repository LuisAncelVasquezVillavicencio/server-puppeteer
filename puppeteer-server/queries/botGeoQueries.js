/**
 * Mapa de Geolocalización de Bots
 *
 * Este módulo proporciona funciones para analizar la distribución geográfica de los bots
 * registrados en la tabla "bot_requests". Se enfoca en responder preguntas de negocio como:
 *
 *  - ¿De qué países proviene el tráfico de bots?
 *  - ¿Qué porcentaje del tráfico automatizado corresponde a cada país?
 *  - ¿Existen patrones geográficos inusuales (por ejemplo, bots legítimos que provienen de países inesperados)?
 *
 * Métrica posible:
 *   - Tráfico de bots por país (%)
 *     Ejemplo: 60% EE.UU., 20% India, 10% Perú, etc.
 *
 * La función acepta parámetros de fecha (startDate y endDate) para filtrar la información
 * en un rango temporal, permitiendo análisis históricos y tendencias.
 *
 * Los parámetros deben ser cadenas en formato ISO (ej: '2025-03-01T00:00:00Z').
 */

const pool = require('../services/dbConfig'); 

/**
 * getBotGeoDistribution
 *
 * Esta función consulta la tabla "bot_requests" para obtener la distribución de bots por país.
 * Solo se consideran los registros que tienen un valor en la columna "country" (extraído de cf-ipcountry).
 *
 * A nivel de negocio, esta consulta permite:
 *  - Visualizar de qué países proviene el tráfico automatizado.
 *  - Detectar concentraciones de tráfico (por ejemplo, identificar ataques o scraping desde un solo país).
 *
 * @param {string} startDate - Fecha de inicio en formato ISO (ej: '2025-03-01T00:00:00Z')
 * @param {string} endDate - Fecha de fin en formato ISO (ej: '2025-03-02T00:00:00Z')
 * @returns {Promise<Array>} Array de objetos con las propiedades:
 *    - country: Código de país (ej: 'PE', 'US', etc.)
 *    - total: Número total de solicitudes registradas para ese país.
 *    - percentage: Porcentaje que representa ese país sobre el total de registros (dentro del rango de fechas).
 */
async function getBotGeoDistribution(startDate, endDate) {
  /*const query = `
    SELECT 
      country,
      COUNT(*) AS total,
      ROUND((COUNT(*) * 100.0 / 
        (SELECT COUNT(*) FROM bot_requests 
         WHERE timestamp BETWEEN $1 AND $2 AND country IS NOT NULL)
      )::numeric, 2) AS percentage
    FROM bot_requests
    WHERE timestamp BETWEEN $1 AND $2
      AND country IS NOT NULL
    GROUP BY country
    ORDER BY total DESC;
  `;*/
  const query = `
    SELECT 
      *
    FROM bot_requests ;
  `;
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("❌ Error en getBotGeoDistribution:", error);
    throw error;
  }
}

module.exports = {
  getBotGeoDistribution,
};
