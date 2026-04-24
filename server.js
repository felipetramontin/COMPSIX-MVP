// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(logger);

// Routes
app.use('/api', routes);

// 404 + Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
