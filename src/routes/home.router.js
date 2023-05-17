const express = require('express');
const { Router } = require('express');
const homeRouter = express.Router();

const ProductManager = require('../productManager.js');
const path = "../products.json";
const productManager = new ProductManager('../product.json');



homeRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        console.log(products)
        return res.render("products", {products})
    } catch (error) {
        res.status(400).json({mes: "error"})
    }
})

module.exports = homeRouter;
