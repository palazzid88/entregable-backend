const express = require('express')
const { Router } = require('express');
const cartRouter = express.Router();
const CartController = require('../controllers/cart.controller');
const cartController = require('../controllers/cart.controller');
// const CartService = require('../services/cart.service');
// const CartManager = require('../DAO/cartManager.js');
// const ProductManager = require('../DAO/productManager.js');
// const CartModel = require('../DAO/models/carts.model.js');
// const path = "../carts.json"
// const cartManager = new CartManager (path)
// const productManager = new ProductManager('../product.json')

// const Cart = new CartService ();

// Crea un nuevo carrito
cartRouter.get("/", CartController.createCart );

// Añade un producto al carrito por body
cartRouter.put("/:cid/products/:pid", CartController.addToCart );

// Eliminar un producto del carrito
cartRouter.delete("/:cid/product/:pid", CartController.deleteProductToCart );

// Vaciar todo el carrito:
cartRouter.delete("/:cid", CartController.clearCart );

// populate products
cartRouter.get("/:cid", CartController.getCartById );

// modificar el contenido de los productos
cartRouter.put("/:cid", CartController.updateCart );

// añadir un producto al carro
cartRouter.put("/:cid/products/:pid", CartController.addProduct );

// 
cartRouter.post("/:cid/purchase", cartController.purchaseCart );

module.exports = cartRouter

//Modificar cantidad de un producto
// cartRouter.put("/:cid/products/:pid", async (req, res) => {
//     try {
//         const cid = req.params.cid;
//         const pid = req.params.pid;
//         const quantity = req.body.quantity;

//         const result = await Cart.updateProductQuantity(cid, pid, quantity);

//         return res.status(200).json({ message: "Cantidad de producto actualizada en el carrito", cart: result });
//     } catch (e) {
//         return res.status(500).json({
//             status: "error",
//             msg: "Algo salió mal",
//             data: {},
//         });
//     }
// });




    

    



