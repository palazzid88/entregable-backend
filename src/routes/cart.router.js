const express = require('express')
const { Router } = require('express');
const cartRouter = express.Router();

const CartManager = require('../DAO/cartManager.js');
const ProductManager = require('../DAO/productManager.js');
const CartModel = require('../DAO/models/carts.models.js');
const CartService = require('../services/cart.services.js');
const path = "../carts.json"
const cartManager = new CartManager (path)
const productManager = new ProductManager('../product.json')

const Cart = new CartService ();

// Crea un nuevo carrito
cartRouter.get("/", async (req, res) => {
    try {
        const result = await Cart.createOne()
        const cartId = result._id.toString();
        console.log("result", result);
        console.log("cart", cartId)
        return res.status(201).json({ message: "se creo un nuevo carrito", result })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
    });
        
    }
});
// Añade un producto al carrito por body
cartRouter.put("/:cid/products/:pid", async (req,res) => {
    console.log("entro al products")
    try {
        const cid = req.params.cid.toString();
        const pid = req.params.pid.toString();
        const qty = req.body.quantity.toString();
        console.log("params", cid, pid, qty)

        const result = await Cart.addProdToCart(cid, pid, qty);
        console.log("result", result)
        return res.status(201).json({ message: "producto añadido al carrito", Cart })
    } catch (e) {
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
    });
}
});



// Eliminar un producto del carrito
cartRouter.delete("/:cid/product/:pid", async (req,res) => {
    try {
        console.log("ingreso al delete");
        const cid = req.params.cid.toString();
        const pid = req.params.pid.toString();
        console.log("params", cid, pid)

        const result = await Cart.delProdToCart(cid, pid);
        console.log("result", result);

        return res.status(201).json({ message: "producto eliminado del carrito" })
    } catch (e) {
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
    });
    }
})

// Vaciar todo el carrito:
cartRouter.delete("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const result = await Cart.cleanToCart(cid);

        return res.status(201).json({ message: `se vació el carrito con ID: ${cid}` })
    } catch (e) {
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
    });
    }
})

//Modificar cantidad de un producto
cartRouter.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;

        const result = await Cart.updateProductQuantity(cid, pid, quantity);

        return res.status(200).json({ message: "Cantidad de producto actualizada en el carrito", cart: result });
    } catch (e) {
        return res.status(500).json({
            status: "error",
            msg: "Algo salió mal",
            data: {},
        });
    }
});

// populate products
cartRouter.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        console.log("ingresó a get")
        const cart = await Cart.getCartById(cid);     
        console.log("cart en get", cart)
        
        return res.status(201).json(cart);
    } catch (e) {
        return res.status(500).json({
            status: "error",
            msg: "Algo salió mal",
            data: {},
        });
    }
})

// modificar el contenido de los productos
cartRouter.put("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const products = req.body.products;

        const result = await Cart.updateCart(cid, products);
        console.log("result", result)
        return res.status(201).json({ message: `carro actualizado satisfactoriamente` })
    } catch (e) {
        return res.status(500).json({
            status: "error",
            msg: "Algo salió mal",
            data: {},
        });
    }
})


module.exports = cartRouter
