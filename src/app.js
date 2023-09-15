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
const FileStore = require('session-file-store')(session);
const FileStoreSession = require('session-file-store')(session);
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const path = require("path");
const { serialize } = require('v8');
const ProductManager = require('./DAO/memory/productManager.js');
const { connectMongo } = require('./utils/utils.js');
const ChatModel = require('./DAO/mongo/models/chat.socket.model.js');
const MongoStore = require('connect-mongo');
const iniPassport = require('./config/passport.config.js');
const passport = require('passport');
const sessionsRouter = require('./routes/sessions.router.js');
const mockingRouter = require('./routes/mocking.router.js');
const loggerRouter = require('./routes/logger.router.js');
const productManager = new ProductManager('product.json')
const logger = require('./utils/logger.js');
const configureSockets = require('./configure.socket.js');
const userRouter = require('./routes/user.router.js');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
// const path = require('path');


const app = express() 
const port = 8080;

const httpServer = http.createServer(app);

configureSockets(httpServer)

connectMongo()

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    store: MongoStore.create({ mongoUrl: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@coder-house.ekzznmk.mongodb.net/`, ttl: 7200 }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);

iniPassport();
app.use(passport.initialize());
app.use(passport.session());

// createLogger();
app.get("/", (req, res) => {
  res.redirect("/auth/login"); // Redirige a la página de inicio de sesión
});


//-----------Swagger-Config------------------
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de e-commers Val di Sole Bikes',
    version: '1.0.0',
    description: 'Entregable Documentación API',
  },
  servers: [
    {
      url: process.env.SWAGGER_SERVER_URL_LOCAL || 'https://proyecto-backend-9f3q.onrender.com',
    },
  ],
};

// Opciones para Swagger JSDoc
const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, 'utils', 'swagger-config.yaml')], // Utiliza __dirname para obtener la ruta del archivo

  // apis: ['./src/utils/swagger-config.yaml'], // Ajusta la ruta según donde tengas definidas tus rutas
};

// Crea el objeto Swagger JSDoc
const swaggerSpec = swaggerJSDoc(options);




//------Endpoint Documentación----------
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

// -------Peticiones API REST---------
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
// app.use('/api', cartRouter);
app.use('/api', userRouter)

//---------Login GitHub----------------
app.use('/api/sessions', sessionsRouter);

// ---------Peticiones HTML-----------
app.use('/homeHandlebars', homeRouter);

// -----Peticiones websocket----------
app.use('/realTimeProducts', rtpRouter);
app.use('/chat', chatRouter);

// --------------Views-----------------
app.use('/views', viewsRouter);

//--------------Login------------------
app.use('/auth', authRouter);

//-----------Moking Test---------------
app.use('/', mockingRouter)

//----------Logger Test----------------
app.use('/', loggerRouter)

//-------------session------------------
app.get('/get-session', (req, res) => {
  const cartId = req.session;
  loggerInstance.info("routesession")
  res.json({ cartId });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})