// language: javascript
// Archivo: server-puppeteer/puppeteer-server/services/cacheService.js
const redis = require('redis');
const client = redis.createClient({ url: 'redis://localhost:6379' });

client.connect().catch(console.error);

async function setCache(key, value, ttlSeconds = 3600) {
  await client.setEx(key, ttlSeconds, value);
}

async function getCache(key) {
  return await client.get(key);
}

module.exports = { setCache, getCache };