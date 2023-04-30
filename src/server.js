const express = require('express');
const ProductManager = require("./productManager")
const { parse } = require('path');
const { stringify } = require('querystring');
const { error } = require('console');
const app = express()
const port = 8080;
const path = "./products.json" 
const  productManager = new ProductManager (path)

const alumno = {
  nombre: "David",
  apellido: "Palazzi",
  curso: "Backend",
  comisión: 51380 
}


//#### GET HOME #### 
app.get('/', async (req, res) => {
  try {
    res.status(200).json(alumno)
  } catch (error) {
      res.status(404).json({message: "página no encontrada"})    
  }
});


//#### GET PRODUCTS ####
app.get('/api/products', async (req, res) => {
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
});


//#### GET PRODUCT POR ID ####
app.get('/api/products/:id', async (req, res) => {
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
});

//### POST ###


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})