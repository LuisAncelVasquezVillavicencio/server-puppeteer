const pool = require('../services/dbConfig'); 


const BOT_DEFINITIONS = [
    // === Buscadores ===
    {
      label: "Google",
      patterns: [
        "googlebot",
        "developers.google.com/+/web/snippet",
        "google page speed",
        "google-inspectiontool",
      ],
      logo: "https://example.com/logos/google.png",
      category: "Buscadores"
    },
    {
      label: "Bing",
      patterns: [ "bingbot" ],
      logo: "https://example.com/logos/bing.png",
      category: "Buscadores"
    },
    {
      label: "Yahoo",
      patterns: [ "yahoo! slurp" ],
      logo: "https://example.com/logos/yahoo.png",
      category: "Buscadores"
    },
    {
      label: "Yandex",
      patterns: [ "yandex" ],
      logo: "https://example.com/logos/yandex.png",
      category: "Buscadores"
    },
    {
      label: "Baidu",
      patterns: [ "baiduspider" ],
      logo: "https://example.com/logos/baidu.png",
      category: "Buscadores"
    },
  
    // === Redes Sociales ===
    {
      label: "Facebook",
      patterns: [ "facebookexternalhit" ],
      logo: "https://example.com/logos/facebook.png",
      category: "Redes Sociales"
    },
    {
      label: "Twitter",
      patterns: [ "twitterbot" ],
      logo: "https://example.com/logos/twitter.png",
      category: "Redes Sociales"
    },
    {
      label: "WhatsApp",
      patterns: [ "whatsapp" ],
      logo: "https://example.com/logos/whatsapp.png",
      category: "Redes Sociales"
    },
    {
      label: "LinkedIn",
      patterns: [ "linkedinbot" ],
      logo: "https://example.com/logos/linkedin.png",
      category: "Redes Sociales"
    },
    {
      label: "Slack",
      patterns: [ "slackbot" ],
      logo: "https://example.com/logos/slack.png",
      category: "Redes Sociales"
    },
    {
      label: "Discord",
      patterns: [ "discordbot" ],
      logo: "https://example.com/logos/discord.png",
      category: "Redes Sociales"
    },
    {
      label: "Telegram",
      patterns: [ "telegrambot" ],
      logo: "https://example.com/logos/telegram.png",
      category: "Redes Sociales"
    },
  
    // === Scrapers (ejemplos) ===
    {
      label: "Python Requests",
      patterns: [ "python-requests" ],
      logo: "https://example.com/logos/python.png",
      category: "Scrapers"
    },
    {
      label: "cURL",
      patterns: [ "curl" ],
      logo: "https://example.com/logos/curl.png",
      category: "Scrapers"
    },
    {
      label: "AhrefsBot",
      patterns: [ "ahrefsbot" ],
      logo: "https://example.com/logos/ahrefs.png",
      category: "Scrapers"
    },
  
    // === Otros (ejemplos varios) ===
    {
      label: "Apple",
      patterns: [ "applebot" ],
      logo: "https://example.com/logos/apple.png",
      category: "Otros"
    },
    {
      label: "Pinterest",
      patterns: [ "pinterestbot", "pinterest/0." ],
      logo: "https://example.com/logos/pinterest.png",
      category: "Otros"
    },
    {
      label: "Reddit",
      patterns: [ "redditbot" ],
      logo: "https://example.com/logos/reddit.png",
      category: "Otros"
    },
    {
      label: "Tumblr",
      patterns: [ "tumblr" ],
      logo: "https://example.com/logos/tumblr.png",
      category: "Otros"
    },
    {
      label: "Quora",
      patterns: [ "quora link preview" ],
      logo: "https://example.com/logos/quora.png",
      category: "Otros"
    },
    {
      label: "W3C Validator",
      patterns: [ "w3c_validator" ],
      logo: "https://example.com/logos/w3c.png",
      category: "Otros"
    },
    {
      label: "Nuzzel",
      patterns: [ "nuzzel" ],
      logo: "https://example.com/logos/nuzzel.png",
      category: "Otros"
    },
    {
      label: "Outbrain",
      patterns: [ "outbrain" ],
      logo: "https://example.com/logos/outbrain.png",
      category: "Otros"
    },
    {
      label: "Chrome Lighthouse",
      patterns: [ "chrome-lighthouse" ],
      logo: "https://example.com/logos/chrome.png",
      category: "Otros"
    },
    {
      label: "Integration Test",
      patterns: [ "integration-test" ],
      logo: null,
      category: "Otros"
    },
    {
      label: "Bitrix",
      patterns: [ "bitrix link preview" ],
      logo: "https://example.com/logos/bitrix.png",
      category: "Otros"
    },
    {
      label: "Xing",
      patterns: [ "xing-contenttabreceiver" ],
      logo: "https://example.com/logos/xing.png",
      category: "Otros"
    },
    {
      label: "Embedly",
      patterns: [ "embedly" ],
      logo: "https://example.com/logos/embedly.png",
      category: "Otros"
    },
    {
      label: "Moz (RogerBot)",
      patterns: [ "rogerbot" ],
      logo: "https://example.com/logos/moz.png",
      category: "Otros"
    },
    // etc...
];

  
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
            timestamp TIMESTAMP,
            render_time INTEGER,
            error TEXT,
            ip TEXT,
            user_agent TEXT,
            referrer TEXT,
            network JSONB,
            bot_type TEXT,
            bot_category TEXT,
            bot_logo TEXT 
        );
    `;
    try {
        await pool.query(query);
        console.log("✅ Tabla 'bot_requests' verificada o creada");
    } catch (error) {
        console.error("❌ Error al verificar/crear la tabla bot_requests:", error);
    }
}

function detectBotData(userAgent) {
    if (!userAgent) {
      return {
        label: null,
        category: null,
        logo: null
      };
    }
  
    const lowerUA = userAgent.toLowerCase();
  
    for (const { label, patterns, logo, category } of BOT_DEFINITIONS) {
      for (const pattern of patterns) {
        if (lowerUA.includes(pattern.toLowerCase())) {
          // Retorna el primer match encontrado
          return {
            label,
            category,
            logo
          };
        }
      }
    }
  
    // Si no encontró match, lo consideramos "Other"
    return {
      label: "Other",
      category: "Otros",
      logo: null
    };
}
  

async function saveRequestData(data) {
    await ensureTableExists(); // Asegurar que la tabla existe antes de insertar datos
    
    const query = `
        INSERT INTO bot_requests (
        url, method, headers, query_params, body, timestamp,
        render_time, error, ip, user_agent, referrer, network,
        bot_type, bot_category, bot_logo
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `;
    
    const userAgent = data.headers?.['user-agent'] || null;
    const { label, category, logo } = detectBotData(userAgent);


    const values = [
        data.url,
        data.method,
        JSON.stringify(data.headers),
        JSON.stringify(data.query_params || {}),  // Manejos seguro
        data.body || null,
        new Date(parseInt(data.timestamp)).toISOString(),   // PostgreSQL acepta objetos Date directamente
        data.render_time || null,
        data.error || null,
        data.headers?.['x-real-ip'] || data.headers?.['cf-connecting-ip'] || null, // Extraer IP
        data.headers?.['user-agent'] || null,  // Extraer User-Agent
        data.headers?.['referer'] || null,  // Extraer Referrer
        JSON.stringify(data.network) || null,
        label,     // bot_type
        category,  // bot_category
        logo      // bot_logo
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
