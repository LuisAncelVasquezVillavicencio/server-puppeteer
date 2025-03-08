const pool = require('../services/dbConfig'); 


// Ejemplo:
async function getBotActivityStats(startDate, endDate) {
  let query = `
    SELECT
      TO_CHAR(timestamp, 'MM/DD') AS fecha,
      COUNT(CASE WHEN isbot = true THEN 1 END)::int AS bot_requests,
      COUNT(CASE WHEN isbot = false OR isbot IS NULL THEN 1 END)::int AS user_requests
    FROM bot_requests
  `;
  const params = [];

  if (startDate && endDate) {
    query += ` 
      WHERE timestamp >= $1
        AND timestamp < $2
    `;
    params.push(startDate, endDate);
  }

  query += `
    GROUP BY 1
    ORDER BY 1
  `;

  try {
    const { rows } = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('Error al obtener estadísticas de bot_requests:', error);
    throw error;
  }
}

module.exports = {
  getBotActivityStats
};