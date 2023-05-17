// const express = require('express');
// const { Router } = require('express');
// const rtpHtmlRouter = express.Router();
// const ProductManager = require('../productManager');
// const path = "../products.json"
// const productManager = new ProductManager (path);

// rtpHtmlRouter.get('/', async (req, res)=> {
//     try {
//         const products = await productManager.getProducts()
//         console.log("en get")
//         return res.render("products", {products})
        
//     } catch (error) {
//         res.status(400).json({ msj: "error" })
//     }
// })

// module.exports = rtpHtmlRouter;
