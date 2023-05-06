const express = require('express');
const productRouter = require('./routes/product.router.js');
const cartRouter = require('./routes/cart.router.js')
const app = express()
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));



app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)









/*

//#### GET HOME #### 
app.use('/api/products', async (req, res) => {
  try {
    res.status(200).json(alumno)
  } catch (error) {
      res.status(404).json({message: "página no encontrada"})    
  }
});
*/
/*
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


*/
//### POST ###


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})