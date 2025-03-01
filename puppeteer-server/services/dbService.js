const { Pool } = require('pg');

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 5432,
});

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
        VALUES ($1, $2, $3, $4, $5, to_timestamp($6 / 1000.0), $7, $8, $9, $10, $11, $12)
    `;
    
    const values = [
        data.url,
        data.method,
        JSON.stringify(data.headers),
        JSON.stringify(data.queryParams),
        data.body,
        data.timestamp,
        data.renderTime || null,
        data.error || null,
        data.ip || null,
        data.userAgent || null,
        data.referrer || null,
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
