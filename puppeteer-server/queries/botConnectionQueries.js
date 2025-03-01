/**
 * Tipos de Conexión de los Bots
 *
 * Este módulo proporciona funciones para analizar el tipo de conexión que utilizan los bots registrados en la
 * tabla "bot_requests". Se enfoca en extraer el valor de la cabecera "x-forwarded-proto" para identificar si la
 * conexión se realizó a través de HTTP o HTTPS.
 *
 * Preguntas de negocio que responde:
 *   - ¿Qué porcentaje del tráfico de bots utiliza HTTPS versus HTTP?
 *     Ejemplo: 80% HTTPS, 20% HTTP.
 *   - Detectar conexiones potencialmente sospechosas: conexiones vía HTTP pueden indicar tráfico anómalo o no legítimo.
 *
 * La función acepta parámetros de fecha (startDate y endDate) en formato ISO para filtrar los datos en un rango temporal,
 * permitiendo análisis históricos y la identificación de tendencias.
 */

const pool = require('../services/dbConfig'); 
/**
 * getBotConnectionTypeDistribution
 *
 * Esta función consulta la tabla "bot_requests" para determinar la distribución de solicitudes según el tipo de conexión
 * (HTTP vs HTTPS), utilizando la cabecera "x-forwarded-proto". Se filtra la consulta en un rango de fechas definido por
 * startDate y endDate.
 *
 * A nivel de negocio, esta consulta permite:
 *   - Conocer el porcentaje de bots que utilizan HTTPS frente a HTTP.
 *   - Detectar si existe un porcentaje elevado de conexiones HTTP, lo que podría indicar tráfico sospechoso.
 *
 * @param {string} startDate - Fecha de inicio en formato ISO (ej: '2025-03-01T00:00:00Z')
 * @param {string} endDate - Fecha de fin en formato ISO (ej: '2025-03-02T00:00:00Z')
 * @returns {Promise<Array>} - Array de objetos con las propiedades:
 *    - connection_type: Tipo de conexión ('http' o 'https')
 *    - total: Número total de solicitudes para ese tipo.
 *    - percentage: Porcentaje que representa ese tipo respecto al total en el rango de fechas.
 */
async function getBotConnectionTypeDistribution(startDate, endDate) {
  const query = `
    SELECT 
      LOWER(headers->>'x-forwarded-proto') AS connection_type,
      COUNT(*) AS total,
      ROUND((COUNT(*) * 100.0 / 
        (SELECT COUNT(*) FROM bot_requests 
         WHERE timestamp BETWEEN $1 AND $2 
           AND headers->>'x-forwarded-proto' IS NOT NULL)
      )::numeric, 2) AS percentage
    FROM bot_requests
    WHERE timestamp BETWEEN $1 AND $2
      AND headers->>'x-forwarded-proto' IS NOT NULL
    GROUP BY connection_type
    ORDER BY total DESC;
  `;
  try {
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  } catch (error) {
    console.error("❌ Error en getBotConnectionTypeDistribution:", error);
    throw error;
  }
}

module.exports = {
  getBotConnectionTypeDistribution,
};
