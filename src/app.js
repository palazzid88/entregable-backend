const express = require('express');
const http = require('http');
const socketIO = require('socket.io');


const productRouter = require('./routes/product.router.js');
const cartRouter = require('./routes/cart.router.js');
const homeRouter = require('./routes/home.router.js');
const rtpRouter = require('./routes/rpt.socket.router.js')
// const rtpHtmlRouter = require('./routes/rtpHtml.router.js')

const handlebars = require('express-handlebars');

const path = require("path");
const { serialize } = require('v8');
const ProductManager = require('./productManager.js');
const productManager = new ProductManager('product.json')

const app = express() 
const port = 8080;

const httpServer = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));



// Peticiones API REST
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
// Peticiones HTML
app.use('/homeHandlebars', homeRouter);
// Peticiones websocket
app.use('/realTimeProducts', rtpRouter);



const io = socketIO(httpServer);

io.on('connection', (socket) => {
  console.log("se abrio un canal de socket");

// Anidir productos a persistencia => recibe desde index.js
  socket.on("newProduct", async (prod) => {
    const newProduct = await productManager.addProduct(prod)
    console.log(newProduct)
    console.log("Nuevo producto recibido:", prod);
    const updatedProducts = await productManager.getProducts();

// Retorna todos los productos actualizados al DOM 
    socket.emit("productListUpdated", updatedProducts);
  })

// Eliminar productos de persistencia
  socket.on("deleteProdId", async (id) =>{
    const deleteProd = await productManager.deleteProduct(id)
    const updatedProducts = await productManager.getProducts();

// Retorna todos los productos actualizados al DOM 
    socket.emit("productListUpdated", updatedProducts)
  })
})

httpServer.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

