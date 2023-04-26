const express = require('express');
const ProductManager = require('./productManager')
const app = express()
const port = 3000
const path = "./products.json"
const  productManager = new ProductManager (path)

//productManager => inicia con 10 objetos en products.json


app.get('/products', async (req, res) => {
    const products = await productManager.getProducts()
  res.json(products)
});



app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})