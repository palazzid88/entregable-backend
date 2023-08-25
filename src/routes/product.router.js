const express = require('express');
const productRouter = express.Router();
const ProductController = require('../controllers/products.controller');
const productValid = require('../middlewares/validation');
const { isAdmin } = require('../middlewares/auth');

productRouter.get('/', ProductController.getAll);

productRouter.get('/:id',productValid, ProductController.getProductById);

productRouter.post('/',productValid, isAdmin, ProductController.createProduct);

productRouter.delete('/:id', isAdmin, ProductController.deleteProduct);

productRouter.put('/:id', isAdmin, ProductController.updateProduct);

module.exports = productRouter;