const pool = require('../services/dbConfig'); 


// Ejemplo:
async function getBotActivityStats(startDate, endDate) {

  let query = `
    SELECT
      TO_CHAR(timestamp, 'MM/DD') AS fecha,
      COUNT(*)::int AS total
    FROM bot_requests
  `;
  const params = [];

  // Filtrado por rango de fechas si existe
  if (startDate && endDate) {
    query += ` 
      WHERE timestamp >= $1
        AND timestamp < $2
    `;
    params.push(startDate, endDate);
  }

  // Agrega el GROUP BY y ORDER BY
  query += `
    GROUP BY 1
    ORDER BY 1
  `;

  try {
    const { rows } = await pool.query(query, params);
    // rows será un array de objetos { fecha, total }
    return rows;
  } catch (error) {
    console.error('Error al obtener estadísticas de bot_requests:', error);
    throw error;
  }
}

module.exports = {
  getBotActivityStats
};
