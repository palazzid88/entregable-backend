const express = require('express');
const productRouter = express.Router();
const ProductController = require('../controllers/products.controller');

productRouter.get('/', ProductController.getAll);

productRouter.get('/:id', ProductController.getProductById);

productRouter.post('/', ProductController.createProduct);

productRouter.delete('/:id', ProductController.deleteProduct);

productRouter.put('/:id', ProductController.updateProduct);

module.exports = productRouter;