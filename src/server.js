const express = require('express');
const ProductManager = require('./productManager'); 
//=> se exporta importa clase ProductManager
const { parse } = require('path');
const { stringify } = require('querystring');
const app = express()
const port = 8080;
const path = "./products.json" 
//=> se declara ruta JSON
const  productManager = new ProductManager (path) 
//=> se crea instancia de ProductManager

//productManager => inicia con 10 objetos en products.json

//=> endpoints "todos los productos"
app.get('/products', (req, res) => {
    const products = productManager.getProducts()
    res.send(products)
});

//=> endpoints "productos por id" => en método productById(), en productManager.js, 
//   se cambia === por ==, dado a que el ID del endpoint es string.
app.get('/products/:id', (req, res) => {
    const id = req.params.id; //=> este dato devuelve un string
    console.log(id) 
    const products = productManager.getProductById(id) //=> pasa el id en string como parámetro para el método
    res.json(products)
});


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})