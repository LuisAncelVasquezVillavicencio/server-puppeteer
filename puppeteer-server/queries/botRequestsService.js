const pool = require('../services/dbConfig'); 

async function getBotActivityStats(startDate, endDate) {
  let query = `
    SELECT
      timestamp,
      isbot,
      EXTRACT(EPOCH FROM timestamp) as epoch_time
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
    ORDER BY timestamp ASC
  `;

  try {
    const { rows } = await pool.query(query, params);
    return rows.map(row => ({
      ...row,
      timestamp: new Date(row.timestamp).toISOString()
    }));
  } catch (error) {
    console.error('Error al obtener estadísticas de bot_requests:', error);
    throw error;
  }
}

module.exports = {
  getBotActivityStats
};