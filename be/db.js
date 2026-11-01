const { Pool } = require('pg');
const { appConfig } = require('./src/configs/app.config');

const pool = new Pool({
  host: appConfig.db.host,
  port: appConfig.db.port,
  user: appConfig.db.user,
  password: appConfig.db.password,
  database: appConfig.db.name,
  ssl: appConfig.db.ssl ? { rejectUnauthorized: true } : false,
});

pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err.message);
  process.exit(1);
});

module.exports = pool;
