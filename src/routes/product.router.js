const express = require('express');
const productRouter = express.Router();
const ProductController = require('../controllers/products.controller');
const productValid = require('../middlewares/validation');
const { isAdmin, isPremium, isProductCreator } = require('../middlewares/auth');
const { id } = require('../DAO/memory/productManager');

productRouter.get('/', ProductController.getAll);

productRouter.get('/:id',productValid, ProductController.getProductById);

productRouter.post('/',productValid, isProductCreator, ProductController.createProduct);

productRouter.delete('/:id', isAdmin, ProductController.deleteProduct);

productRouter.put('/:id', isAdmin, ProductController.updateProduct);

module.exports = productRouter;