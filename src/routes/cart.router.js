const express = require('express')
const { Router } = require('express');
const cartRouter = express.Router();

const CartManager = require('../cartManager.js');
const ProductManager = require('../productManager.js')
const path = "../carts.json"
const cartManager = new CartManager (path)
const productManager = new ProductManager('../product.json')


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

cartRouter.get('/:id', async (req, res) => {
    // debe traer el carrito con un id
try {
        const { id } = req.params;
        const cart = await cartManager.getProductsToCartById(id)
    if (!cart) {
        res.status(404).json("carrito no encontrado")
    } else {
        res.status(200).json(cart);
    }
    } catch (error) {
        res.status(500).json({ message: 'Hub un error' })
}})

cartRouter.post('/', async (req, res) => {
// debe crear un nuevo carrito en cart.json con id nuevo, y un objeto products[]
try {
    const carts = await cartManager.createCart();
    console.log("entra cart.router?")
    res.status(200).json({ message: 'carrito creado con éxito' })
} catch (error) {
    res.status(500).json({ message: 'hubo un error al querer añadir al carrito'})
}
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    // debe añadir el id de un producto en el array de productos [], dentro de un objeto carts, debe tener un quantity 
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const cart = await cartManager.getProductsToCartById(cid);
        const product = await productManager.getProductById(pid);
        console.log("partió la peticion")
        if (!cart || !product) {
            console.log("nagativa");
            res.status(201).json({ message: 'error' });
        } else {
            if (cart && product) {
                console.log(`hay un carrito para añadir el prod ${cid}`);
                console.log(`hay un prod con ese id: ${pid}`);
                await cartManager.addProductIdinCartId(cid, pid);
                res.status(200).json({ message: `se añadio el prodcucto con ID:${pid} al carrito con ID:${cid}`, 
            status: `Exitoso`})
            }
        }
    } catch (error) {
        res.status(500).json({ message: `hubo un error al querer añadir el prd al carrito`})
    }
})



module.exports = cartRouter