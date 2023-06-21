const express = require('express');
const http = require('http');
const socketIO = require('socket.io');


const productRouter = require('./routes/product.router.js');
const cartRouter = require('./routes/cart.router.js');
const homeRouter = require('./routes/home.router.js');
const rtpRouter = require('./routes/rpt.socket.router.js')
const chatRouter = require('./routes/chat.socket.router.js');
const viewsRouter = require('./routes/views.router.js');
const authRouter = require('./routes/auth.router.js')
// const rtpHtmlRouter = require('./routes/rtpHtml.router.js')
const session = require('express-session');
// const FileStore = require('session-file-store')(session);
const FileStoreSession = require('session-file-store')(session);
const passport = require('passport');
const bodyParser = require('body-parser');


const handlebars = require('express-handlebars');

const path = require("path");
const { serialize } = require('v8');
const ProductManager = require('./DAO/productManager.js');
const { connectMongo } = require('./utils.js');
const ChatModel = require('./DAO/models/chat.socket.model.js');
const MongoStore = require('connect-mongo');
const iniPassport = require('./config/passport.config.js');
const productManager = new ProductManager('product.json')

const app = express() 
const port = 8080;

const httpServer = http.createServer(app);

connectMongo()

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://palazzid88:qv500UC1DtMcjUj8@coder-house.ekzznmk.mongodb.net/', ttl: 7200 }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);

// -------Peticiones API REST---------
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// ---------Peticiones HTML-----------
app.use('/homeHandlebars', homeRouter);

// -----Peticiones websocket----------
app.use('/realTimeProducts', rtpRouter);
app.use('/chat', chatRouter);

// --------------Views-----------------
app.use('/views', viewsRouter)

//--------------Login------------------
app.use('/auth', authRouter)


iniPassport();
app.use(passport.initialize());
app.use(passport.session());






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
// 2) Recibe los msgs desde el front index.js
  socket.on('chat-front-to-back', async (data) => {
  console.log('Mensaje recibido desde el front-end:', data);

  // const { user, message } = data.messages;

  try {
    const chat = await ChatModel.create(data);
    console.log("mensages despues del await en el back",chat)
    // Los reenvía a todos los fronts
    const chats = await ChatModel.find({}).lean().exec();

    const { messages } = chat

    let msgs = messages.map((message) => {
      return { user: message.user, message: message.message }
    })

    console.log("despues del find", msgs)
    io.emit('chat-back-to-all', msgs)
    
  } catch (e) {console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
  });

})

httpServer.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})