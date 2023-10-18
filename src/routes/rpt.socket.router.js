const express = require('express');
const { Router } = require('express');
const rtpRouter = express.Router();
const ProductManager = require('../DAO/memory/productManager');
const path = "../products.json"
const productManager = new ProductManager (path);

rtpRouter.get('/', async (req, res)=> {
    try {
        const products = await productManager.getProducts()
        return res.render("realtimeproducts", { products })
        
    } catch (error) {
        res.status(400).json({ msj: "error" })
    }
})

module.exports = rtpRouter;
