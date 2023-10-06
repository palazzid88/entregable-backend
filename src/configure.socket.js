const socketIO = require('socket.io');
const ChatModel = require('./DAO/mongo/models/chat.socket.model.js');
const ProductModel = require('./DAO/mongo/models/products.model.js');
const ProductService = require('./services/product.service.js');
const productService = new ProductService()

const productModel = new ProductModel()

function configureSockets(httpServer) {
  const io = socketIO(httpServer);

  io.on('connection', (socket) => {
    console.log("se abrio un canal de socket");
  
  // Anidir productos a persistencia => recibe desde index.js
    socket.on("newProduct", async (prod) => {
      console.log("entro en el on de  configure")
      const newProduct = await productService.addProduct(prod)
      console.log(newProduct)
      console.log("Nuevo producto recibido:", prod);
      const updatedProducts = await productService.getAll();
  
  // Retorna todos los productos actualizados al DOM 
      socket.emit("productListUpdated", updatedProducts);
    })
  
  // Eliminar productos de persistencia
    socket.on("deleteProdId", async (id) =>{
      const deleteProd = await productService.deleteProduct(id)
      const updatedProducts = await productService.getProducts();
  
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
}

module.exports = configureSockets;
