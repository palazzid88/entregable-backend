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
      const newProduct = await productService.addProduct(prod)
      const updatedProducts = await productService.getProductsByOwner(prod.owner)
  
  // Retorna todos los productos actualizados al DOM 
      socket.emit("productListUpdated", updatedProducts);
    })
  
  // Eliminar productos de persistencia
    socket.on("deleteProdId", async (productId ) =>{
      const deleteProd = await productService.deleteOne(productId)
      const email = deleteProd.owner
      const updatedProducts = await productService.getProductsByOwner(email);
  
  // Retorna todos los productos actualizados al DOM 
      socket.emit("productListUpdated", updatedProducts)
    })
  // 2) Recibe los msgs desde el front index.js
    socket.on('chat-front-to-back', async (data) => {
  
  
    try {
      const chat = await ChatModel.create(data);
      // Los reenvía a todos los fronts
      const chats = await ChatModel.find({}).lean().exec();
  
      const { messages } = chat
  
      let msgs = messages.map((message) => {
        return { user: message.user, message: message.message }
      })
  
      io.emit('chat-back-to-all', msgs)
      
    } catch (e) {
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
