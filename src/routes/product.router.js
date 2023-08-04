const express = require('express');
const productRouter = express.Router();
const ProductController = require('../controllers/products.controller');
const productValid = require('../middlewares/validation');

productRouter.get('/', ProductController.getAll);

productRouter.get('/:id',productValid, ProductController.getProductById);

productRouter.post('/',productValid, ProductController.createProduct);

productRouter.delete('/:id', ProductController.deleteProduct);

productRouter.put('/:id', ProductController.updateProduct);

module.exports = productRouter;