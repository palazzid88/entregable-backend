const express = require('express')
const { Router } = require('express');
const cartRouter = express.Router();

const CartManager = require('../DAO/cartManager.js');
const ProductManager = require('../DAO/productManager.js');
const CartModel = require('../DAO/models/carts.models.js');
const path = "../carts.json"
const cartManager = new CartManager (path)
const productManager = new ProductManager('../product.json')

//métodos en mongo: 
//=> GET todos los Carts (hecho)
//=> GET Un Cart por ID
//=> POST un prod en un cart


cartRouter.get("/", async (req, res) => {
    console.log("connects carts")
    try {
        const carts = await CartModel.find({})
        return res.status(200).json({
            status: "success",
            msg: "listado de carts",
            data: carts
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
        });
    }
})

cartRouter.get("/cid", async (req, res) => {
    try {
        const { cid } = req.params;

        let cart = await CartModel.findById(cid);
        if (!cart) {
            res.status(201).json({ message: `no existe carrito con id: ${cid}` });
        }
        return res.status(200).json({
            status: "success",
            msg: "listado de carts",
            data: cart
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
        });
    }
    }
)

// cartRouter.post("/", async (req, res) => {
//     try {
//         const cart = await CartModel.create();
//         console.log(cart);
//         res.status(201).json({ message: "se creo un nuevo carrito" })
//     } catch (e) {
//         console.log(e);
//         return res.status(500).json({
//           status: "error",
//           msg: "something went wrong :(",
//           data: {},
//         });
//     }
// })

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    console.log("metodo post")
    try {
        const { cid, pid } = req.params;

        let cart = await CartModel.findById(cid)
        if(!cart) {
            cart = await CartModel.create({ _id: cid, products: [{productId: pid, quantity: 1}] })
            res.status(201).json({ message: "se añadió el producto al carrito" })
        }
        const findProduct = cart.products.findIndex((item) => item.productId === pid);

        if (findProduct === -1) {
            cart.products.push({ productId: pid, quantity: 1 });
          } else {
            cart.products[findProduct].quantity += 1;
          }

        await cart.save()

        return res.status(201).json({ message: "se añadió el producto al carrito" })
    }catch (e) {
        console.log(e);
        return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
        });
    }
})

cartRouter.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findById(cid);
        if (!cart) {
            return res.status(201).json({ message: `No existe carrito con ID: ${cid}` });        
        }
        cart = await CartModel.deleteOne(cid);
        res.status(201).json({ message: `se eliminó carrito con ID: ${cid}` }); 
    } catch (e) {
        console.log(e);
        return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
        });
    }
})

cartRouter.delete("/cid/products/pid", async (req, res) => {
    console.log("ingresó al delete product to cart")
    try {
        const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);
    console.log("cart dentro del try", cart)
    if(!cart) {
        console.log("no existe carrito con ese ID")
        return res.status(201).json({ message: `No existe carrito con ID: ${cid}` });        
    }
    const product = cart.find(item => item.id = pid);
    console.log("finf product", product)
    if (product) {
        if (product.quantity > 1) {
            console.log("qty >1")
            quantity = quantity -1;
            return res.status(201).json({ message: `se decrementó la cantidad de productos con ID: ${pid}, del carro ID: ${cid}` })
        }
        else{
            console.log("qty <=1")
            product = await CartModel.deleteOne(cid)
            return res.status(201).json({ message: `se elimonó el producto con ID: ${pid}, del carro ID: ${cid}` })
        }
    }
    else{
        return res.status(201).json({ message: `No existe producto con ID: ${pid}` });
    }

    } catch (e) {
        console.log(e);
        return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
        });
    }
    })


/*
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

*/

module.exports = cartRouter
