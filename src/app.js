const express = require('express');
const productRouter = require('./routes/product.router.js');
const cartRouter = require('./routes/cart.router.js');
const rtpHtmlRouter = require('./routes/rtpHtml.router.js');
const handlebars = require('express-handlebars');
const path = require("path")

const app = express() 
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));



// Peticiones API REST
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

// Peticiones HTML
// app.use('/home', productsHtmlRouter);
app.use('/realTimeProducts', rtpHtmlRouter);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})