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
        const products = await productManager.getProductById(id)
        if (!products) {
          res.status(404).json("producto no encontrado")
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
    const product = await productManager.addProduct(data)
    res.status(201).json({
      success: true,
      payload: product
    })    
  } catch (error) {
      res.status(500).json({ message: "error" })    
  }
})

productRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const products = await productManager.getProductById(id);
    if (!products) {
      res.status(404).json({ message: 'no existe producto con ese ID' })      
    }
    else{
      const prodUpdt = await productManager.updateProduct(id, data);
      res.status(201).json({
        succes: true,
        message: `Producto con ID:${id} actualizado con éxito` 
      })
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `no existe producto ese ID`})
  }
}), 

productRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const products = await productManager.deleteProduct(id)
      res.status(201).json({
        succes: true,
        message: `Se ha eliminado el producto con ID:${id}`
      })
    }
   catch (error) {
      res.status(500).json({message: 'error en ID'})
  }
})

module.exports = productRouter;

