const express = require('express');
const productRouter = express.Router();
const ProductController = require('../controllers/products.controller');
const productValid = require('../middlewares/validation');
const { isAdmin, isPremium, isProductCreator } = require('../middlewares/auth');
const { id } = require('../DAO/memory/productManager');

productRouter.get('/', ProductController.getAll);

productRouter.get('/:pid', ProductController.getProductById);

productRouter.get('/render/form', isProductCreator, ProductController.viewForm)

productRouter.post('/',productValid, isProductCreator, ProductController.createProduct);

productRouter.delete('/:id', isProductCreator, ProductController.deleteProduct);

productRouter.put('/:id', productValid, isProductCreator, ProductController.updateProduct);

module.exports = productRouter;