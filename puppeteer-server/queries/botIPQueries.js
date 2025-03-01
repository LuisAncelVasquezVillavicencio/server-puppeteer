/**
 * Análisis de IPs de Bots
 *
 * Este módulo proporciona funciones para analizar la frecuencia de solicitudes (hits) por IP
 * registradas en la tabla "bot_requests". Se enfoca en responder preguntas de negocio como:
 *
 * - ¿Cuántas veces accede una misma IP en un periodo de tiempo determinado?
 * - ¿Existen IPs con una tasa de solicitudes (hits/minuto) anormalmente alta?
 *
 * Métrica posible:
 *   - Frecuencia de requests por IP (hits/minuto)
 *     Ejemplo: Si la IP 132.251.3.214 realiza 100+ requests en un minuto, puede considerarse un scraper.
 *
 * La función acepta parámetros de fecha (startDate y endDate) en formato ISO para filtrar los datos.
 */

const pool = require('../services/dbConfig'); 

/**
 * getIPFrequency
 *
 * Esta función calcula la frecuencia de solicitudes por IP en un rango de fechas especificado.
 * Se agrupa por la columna "ip" y se cuenta el número total de solicitudes.
 * Luego, conociendo la duración del intervalo (en minutos), se calcula el promedio de solicitudes por minuto.
 *
 * A nivel de negocio, esta consulta te permite:
 *   - Identificar IPs que realizan demasiadas solicitudes en poco tiempo,
 *     lo cual puede indicar scraping o actividades sospechosas.
 *   - Establecer umbrales para bloquear o limitar el rate-limit de ciertas IPs.
 *
 * @param {string} startDate - Fecha de inicio en formato ISO (ej: '2025-03-01T00:00:00Z')
 * @param {string} endDate - Fecha de fin en formato ISO (ej: '2025-03-01T00:10:00Z')
 * @returns {Promise<Array>} - Array de objetos con las propiedades:
 *   - ip: La dirección IP del cliente.
 *   - total_requests: Total de solicitudes registradas para esa IP en el intervalo.
 *   - requests_per_minute: Promedio de solicitudes por minuto.
 */
async function getIPFrequency(startDate, endDate) {
  const query = `
    SELECT 
      ip,
      COUNT(*) AS total_requests
    FROM bot_requests
    WHERE timestamp BETWEEN $1 AND $2
      AND ip IS NOT NULL
    GROUP BY ip
    ORDER BY total_requests DESC;
  `;
  try {
    const result = await pool.query(query, [startDate, endDate]);

    // Calcular la duración del intervalo en minutos
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMinutes = (end - start) / (1000 * 60);

    // Mapear los resultados para incluir la tasa de requests por minuto
    const data = result.rows.map(row => ({
      ip: row.ip,
      total_requests: parseInt(row.total_requests, 10),
      requests_per_minute: diffInMinutes > 0 ? (row.total_requests / diffInMinutes).toFixed(2) : row.total_requests
    }));

    return data;
  } catch (error) {
    console.error("❌ Error en getIPFrequency:", error);
    throw error;
  }
}

module.exports = {
  getIPFrequency,
};
