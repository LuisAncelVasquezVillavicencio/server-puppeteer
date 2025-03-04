const pool = require('../services/dbConfig'); 

// Crear tabla si no existe
async function ensureTableExists() {
    const query = `
        CREATE TABLE IF NOT EXISTS bot_requests (
            id SERIAL PRIMARY KEY,
            url TEXT NOT NULL,
            method TEXT NOT NULL,
            headers JSONB NOT NULL,
            query_params JSONB NOT NULL,
            body TEXT,
            timestamp TIMESTAMP NOT NULL,
            render_time INTEGER,
            error TEXT,
            ip TEXT,
            user_agent TEXT,
            referrer TEXT,
            network JSONB
        );
    `;
    try {
        await pool.query(query);
        console.log("✅ Tabla 'bot_requests' verificada o creada");
    } catch (error) {
        console.error("❌ Error al verificar/crear la tabla bot_requests:", error);
    }
}

async function saveRequestData(data) {
    await ensureTableExists(); // Asegurar que la tabla existe antes de insertar datos
    
    const query = `
        INSERT INTO bot_requests (url, method, headers, query_params, body, timestamp, render_time, error, ip, user_agent, referrer, network)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;

    const values = [
        data.url,
        data.method,
        JSON.stringify(data.headers),
        JSON.stringify(data.query_params || {}),  // Manejo seguro
        data.body || null,
        data.timestamp,  // PostgreSQL acepta objetos Date directamente
        data.render_time || null,
        data.error || null,
        data.headers?.['x-real-ip'] || data.headers?.['cf-connecting-ip'] || null, // Extraer IP
        data.headers?.['user-agent'] || null,  // Extraer User-Agent
        data.headers?.['referer'] || null,  // Extraer Referrer
        JSON.stringify(data.network) || null
    ];
    
    try {
        await pool.query(query, values);
        console.log("✅ requestData guardado en PostgreSQL");
    } catch (error) {
        console.error("❌ Error guardando requestData en PostgreSQL:", error);
    }
}

module.exports = { saveRequestData, ensureTableExists };

// Verificar la tabla al iniciar el servicio
ensureTableExists();
