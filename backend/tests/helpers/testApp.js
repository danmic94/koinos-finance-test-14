// Test application setup - creates an Express app without starting the server
const express = require('express');
const itemsRouter = require('../../src/routes/items');
const { notFound } = require('../../src/middleware/errorHandler');

function createTestApp() {
  const app = express();
  
  // Basic middleware
  app.use(express.json());
  
  // Routes
  app.use('/api/items', itemsRouter);
  
  // Error handling
  app.use('*', notFound);
  
  // Global error handler for tests
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error'
    });
  });
  
  return app;
}

module.exports = { createTestApp };
