const express = require('express');
const app = express();

const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const routes = require('./routes');

// Parse JSON
app.use(express.json());

// Custom request logger
app.use(logger);

// Mount all routes
app.use('/api', routes);

// 404 handler (no route matched)
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;