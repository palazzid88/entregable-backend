const express = require('express');
const mokingController = require('../controllers/moking.controller');
const mockingRouter = express.Router();

// Define las rutas para el módulo de Mocking
mockingRouter.get('/mockingproducts', mokingController.generateMockProducts); // Ruta para generar productos de prueba

module.exports = mockingRouter;
