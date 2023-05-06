const express = require('express')
const { Router } = require('express');
const cartRouter = express.Router();

const CartManager = require('../cartManager.js');
const path = "../carts.json"
const cartManager = new CartManager (path)


const carts = {
    hola: "Hola",
    number: 123,
    code: "rrfg"
}
cartRouter.get('/', async (req, res) => {
// debe traer los productos del carrito identificado con un array
try {
    const carts = await cartManager.getProductsFromCarts()
    res.status(200).json(carts);
} catch (err) {
    return (err)
}
})

cartRouter.post('/', async (req, res) => {
// debe it una fx que cree un objeto carrito con id, y con un array productos []
try {
    const carts = await cartManager.createCart();
    res.status(200).json(carts)
} catch (error) {
    res.status(500).json({ message: 'hubo un error al querer añadir al carrito'})
}
})



module.exports = cartRouter