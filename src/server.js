const express = require('express');
const ProductManager = require('./productManager'); 
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
app.get('/', (req, res) => {
  res.json(alumno)
});


//#### GET PRODUCTS ####
app.get('/products', (req, res) => {
    const products = productManager.getProducts()
    res.send(products)
});


//#### GET PRODUCT POR ID ####
app.get('/products/:id', (req, res) => {
    const id = req.params.id; //=> este dato devuelve un string
    console.log(id) 
    const products = productManager.getProductById(id)
    if (!products) {
      return res.status(201).json("usuario no encontrado")
    }
    return res.status(201).json(products)
});

//### POST ###


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})