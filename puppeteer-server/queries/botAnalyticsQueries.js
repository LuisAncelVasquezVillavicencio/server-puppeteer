/**
 * Análisis de Bots por Plataforma
 *
 * Este módulo contiene funciones para analizar la distribución de bots registrados en la tabla "bot_requests".
 * Se enfoca en identificar la plataforma o tipo de bot (por ejemplo, WhatsApp, Googlebot, Bingbot, etc.) a partir
 * de la información del campo preprocesado "bot_type" y del "user_agent". Además, permite filtrar los datos por un
 * rango de fechas, facilitando análisis históricos y la identificación de tendencias.
 *
 * Preguntas de negocio que responde:
 *   - ¿Qué porcentaje del tráfico automatizado corresponde a cada plataforma o tipo de bot?
 *     (por ejemplo, 40% Googlebot, 30% WhatsApp, 10% scrapers, etc.)
 *   - ¿Cómo se distribuye el tráfico de bots por categorías personalizadas basadas en el user_agent?
 *     Esto permite agrupar bots de redes sociales, buscadores, scrapers y otros.
 *
 * Las funciones principales son:
 *   - getBotDistributionByType: Agrupa por el campo "bot_type" y calcula totales y porcentajes.
 *   - getBotDistributionByCategory: Clasifica el "user_agent" en categorías (Redes Sociales, Buscadores, Scrapers, Otros)
 *     y calcula totales y porcentajes, filtrando los resultados por un rango de fechas.
 *
 * Ambas funciones requieren dos parámetros:
 *   - startDate: Fecha de inicio (en formato ISO, ej: '2025-03-01T00:00:00Z')
 *   - endDate: Fecha de fin (en formato ISO, ej: '2025-03-02T00:00:00Z')
 */

// botAnalyticsQueries.js
const pool = require('../services/dbConfig'); 
/**
 * getBotDistributionByType
 *
 * Esta función agrupa las solicitudes por el campo "bot_type" preprocesado, dentro del rango de fechas especificado.
 *
 * A nivel de negocio, permite conocer qué plataformas de bots generan mayor tráfico,
 * facilitando la toma de decisiones en temas de SEO y seguridad.
 *
 * @param {string} startDate - Fecha de inicio (ISO, ej: '2025-03-01T00:00:00Z')
 * @param {string} endDate - Fecha de fin (ISO, ej: '2025-03-02T00:00:00Z')
 * @returns {Promise<Array>} Array de objetos con { bot_type, total, percentage }
 */
async function getBotDistributionByType(startDate, endDate) {
  const query = `
    SELECT 
      bot_type, 
      COUNT(*) AS total, 
      ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM bot_requests WHERE timestamp BETWEEN $1 AND $2))::numeric, 2) AS percentage
    FROM bot_requests
    WHERE timestamp BETWEEN $1 AND $2
    GROUP BY bot_type
    ORDER BY total DESC;
  `;
  try {
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  } catch (error) {
    console.error("❌ Error en getBotDistributionByType:", error);
    throw error;
  }
}



/**
 * getBotDistributionByCategory
 *
 * Esta función clasifica las solicitudes en categorías basadas en el "user_agent" dentro del rango de fechas.
 * Las categorías definidas son:
 *   - 'Redes Sociales': si el user_agent contiene 'whatsapp', 'facebook' o 'twitter'.
 *   - 'Buscadores': si contiene 'googlebot', 'bingbot' o 'yandex'.
 *   - 'Scrapers': si contiene 'python-requests', 'curl' o 'ahrefsbot'.
 *   - 'Otros': cualquier otro caso.
 *
 * A nivel de negocio, permite identificar de manera agrupada el origen del tráfico automatizado,
 * detectando comportamientos sospechosos y facilitando la implementación de medidas de seguridad.
 *
 * @param {string} startDate - Fecha de inicio (ISO)
 * @param {string} endDate - Fecha de fin (ISO)
 * @returns {Promise<Array>} Array de objetos con { bot_category, total, percentage }
 */
// ... existing code ...

async function getBotDistributionByCategory(startDate, endDate) {
  const query = `
    SELECT 
      label,
      COUNT(*) AS total,
      ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM bot_requests WHERE timestamp BETWEEN $1 AND $2))::numeric, 2) AS percentage
    FROM bot_requests
    WHERE timestamp BETWEEN $1 AND $2
    AND isBot = 'true'
    GROUP BY label
    ORDER BY total DESC;
  `;
  try {
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  } catch (error) {
    console.error("❌ Error en getBotDistributionByCategory:", error);
    throw error;
  }
}

// ... rest of the code ...

module.exports = {
  getBotDistributionByType,
  getBotDistributionByCategory,
};
