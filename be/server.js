const app = require('./src/app');
const { appConfig } = require('./src/configs/app.config');
const { initPostgres } = require('./src/inits/postgres.init');

const PORT = appConfig.port;

const startServer = async () => {
  try {
    // Initialize database (create tables if not exist)
    await initPostgres();
    console.log('✅ Database initialized successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📄 Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
