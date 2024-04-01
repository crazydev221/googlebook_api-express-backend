const redis = require('redis');
const env = require('../const/env');

// Redis database configuration
const client = redis.createClient({
    port: env.REDIS_PORT,
    host: env.REDIS_HOST,
});
client.on('error', (err) => {
    console.log('Redis client error:', err);
});
client.on('connect', () => {
    console.log('Redis client connected');        
});

module.exports = client;
