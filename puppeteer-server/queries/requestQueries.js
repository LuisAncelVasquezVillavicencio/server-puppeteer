const pool = require('../services/dbConfig');

async function getLatestRequests({ page = 1, limit = 10, search = '' }) {
  const offset = (page - 1) * limit;
  
  const query = `
    SELECT 
      id,
      url,
      method,
      timestamp,
      ip,
      isbot,
      bot_type,
      bot_category,
      headers,
      error,
      render_time
    FROM bot_requests
    WHERE 
      CASE 
        WHEN $3 <> '' THEN 
          url ILIKE $3 OR 
          ip ILIKE $3 OR 
          method ILIKE $3
        ELSE TRUE
      END
    ORDER BY timestamp DESC
    LIMIT $1 OFFSET $2;
  `;

  const countQuery = `
    SELECT COUNT(*) 
    FROM bot_requests
    WHERE 
      CASE 
        WHEN $1 <> '' THEN 
          url ILIKE $1 OR 
          ip ILIKE $1 OR 
          method ILIKE $1
        ELSE TRUE
      END;
  `;

  try {
    const [results, countResult] = await Promise.all([
      pool.query(query, [limit, offset, `%${search}%`]),
      pool.query(countQuery, [`%${search}%`])
    ]);

    return {
      requests: results.rows,
      total: parseInt(countResult.rows[0].count),
      pages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  } catch (error) {
    console.error("❌ Error in getLatestRequests:", error);
    throw error;
  }
}

module.exports = {
  getLatestRequests
};