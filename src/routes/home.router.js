const express = require('express');
const { Router } = require('express');
const rtpHtmlRouter = express.Router();

const ProductManager = require('../productManager.js');
const path = "../products.json";
const productManager = new ProductManager('../product.json');



rtpHtmlRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        return res.render("products", {products})
    } catch (error) {
        res.status(400).json({mes: "error"})
    }
})

module.exports = rtpHtmlRouter;
