const express = require('express')
const { Router } = require('express');
const cartRouter = express.Router();
const CartController = require('../controllers/cart.controller');
const cartController = require('../controllers/cart.controller');
const { isUser, isProductCreator, isPremium, isUserOrPremium } = require('../middlewares/auth');


// Crea un nuevo carrito
cartRouter.get("/", CartController.createCart );

// Golpea la vista del cart
cartRouter.get('/view-cart', cartController.viewCart );

//Obtiene el CartId de la session
cartRouter.get('/get-cart-id', cartController.getCartById ); 

// Ruta checkout purchase
cartRouter.get('/checkout/:cartId', cartController.viewCheckout);

// Añade un producto al carrito por body
cartRouter.put("/:cid/products/:pid", CartController.addToCart );

// Eliminar un producto del carrito
cartRouter.delete("/:cid/product/:pid", CartController.deleteProductToCart );

// Vaciar todo el carrito:
cartRouter.delete("/:cid", CartController.clearCart );

// populate products
cartRouter.get("/:cid", CartController.getCartById );

// modificar el contenido de los productos
cartRouter.put("/:cid/product/:pid", CartController.updateCart);

// añadir un producto al carro
cartRouter.put("/:cid/products/:pid", CartController.addProduct );

cartRouter.post("/:cid/purchase", isUserOrPremium, cartController.purchaseCart );


module.exports = cartRouter






    

    



