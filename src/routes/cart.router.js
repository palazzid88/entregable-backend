const express = require('express')
const { Router } = require('express');
const cartRouter = express.Router();
const CartController = require('../controllers/cart.controller');
const cartController = require('../controllers/cart.controller');
const { isUser } = require('../middlewares/auth');


// Crea un nuevo carrito
cartRouter.get("/", CartController.createCart );

// Golpea la vista del cart
cartRouter.get('/view-cart', cartController.viewCart );

//Obtiene el CartId de la session
cartRouter.get('/get-cart-id', cartController.getCartById ); 

// Añade un producto al carrito por body
cartRouter.put("/:cid/products/:pid", isUser, CartController.addToCart );


// Eliminar un producto del carrito
cartRouter.delete("/:cid/product/:pid", CartController.deleteProductToCart );

// Vaciar todo el carrito:
cartRouter.delete("/:cid", CartController.clearCart );

// populate products
cartRouter.get("/:cid", CartController.getCartById );

// modificar el contenido de los productos
cartRouter.put("/:cid", CartController.updateCart );

// añadir un producto al carro
cartRouter.put("/:cid/products/:pid", isUser, CartController.addProduct );

// 
cartRouter.post("/:cid/purchase", isUser, cartController.purchaseCart );


module.exports = cartRouter






    

    



