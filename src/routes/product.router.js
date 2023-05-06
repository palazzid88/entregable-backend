const express = require('express');
const { Router } = require('express');
const productRouter = express.Router();

const ProductManager = require('../productManager');
const path = "../products.json"
const  productManager = new ProductManager (path)


productRouter.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
          const products = await productManager.getProducts()
          if (limit) {
            res.status(200).json(products.slice(0, limit));
          } else {
            res.status(200).json(products);
          }
      } catch (error) {
            res.status(500).json({ message: 'hubo un error'})    
      }
})

productRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params; //=> este dato devuelve un string
        console.log(id) 
        const products = await productManager.getProductById(id)
        if (!products) {
          res.status(404).json("usuario no encontrado")
        } else {
          res.status(200).json(products)
        }    
      } catch (error) {
        res.status(500).json({message: 'error id'})
      }
})

productRouter.post('/', async (req, res) => {
  try {
    const data = req.body
    console.log("firstdata", data)
    const product = await productManager.addProduct(data)
    console.log("data", data)
    res.status(201).json({
      success: true,
      payload: product
    })
    
  } catch (error) {
      res.status(500).json({ message: "error" })    
  }
})

module.exports = productRouter;

