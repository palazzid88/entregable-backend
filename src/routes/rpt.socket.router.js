const express = require('express');
const { Router } = require('express');
const rtpRouter = express.Router();
const ProductManager = require('../productManager');
const path = "../products.json"
const productManager = new ProductManager (path);

rtpRouter.get('/', async (req, res)=> {
    try {
        const products = await productManager.getProducts()
        console.log("entro a rtp")
        console.log(products)
        return res.render("realtimeproducts", { products })
        
    } catch (error) {
        res.status(400).json({ msj: "error" })
    }
})

module.exports = rtpRouter;
