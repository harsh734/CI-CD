const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const { corsMiddleware } = require('./cors');
const { errorHandler } = require('./middlewares/errorHandler');
const { swaggerSpec } = require('./configs/swagger.config');
const { MESSAGES } = require('./constants/messages');
const { HTTP_STATUS } = require('./constants/httpStatus');

// Import routes
const taskRoutes = require('./app/task/task.route');
const authRoutes = require('./app/auth/auth.route');
const userRoutes = require('./app/user/user.route');
const { authRequired } = require('./middlewares/authRequired');

const app = express();

// ─── Global Middlewares ──────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ─── Swagger Docs ────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Todo API Documentation',
}));

// ─── Swagger JSON endpoint ───────────────────────────────────
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─── Health Check ────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', authRequired, taskRoutes);

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    status: 'error',
    message: MESSAGES.ROUTE_NOT_FOUND,
  });
});

// ─── Global Error Handler ────────────────────────────────────
app.use(errorHandler);

module.exports = app;
