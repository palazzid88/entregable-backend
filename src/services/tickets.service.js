const Ticket = require('../DAO/mongo/models/tickets.model');
const Product = require('../DAO/mongo/models/products.model');

class TicketService {
  async purchase(purchaser, cartProducts) {
    console.log("entro al purchase en el service")
    console.log("cartProducts",cartProducts)
    try {
      let totalAmount = 0;
      let productsInCart = [];

      for (const cartProduct of cartProducts) {
        const productInDB = await Product.findById(cartProduct.productId);
        console.log("productInDB en ticketService",productInDB)

        if (!productInDB) {
          console.log("not prod")
          return {
            code: 404,
            result: {
              status: 'notfound',
              message: `Product with ID ${cartProduct.productId} not found`,
            },
          };
        }

        if (productInDB.stock < cartProduct.quantity) {
          console.log("nonstock")
          return {
            code: 400,
            result: {
              status: 'nostock',
              message: `Not enough stock for product ${productInDB.title}`,
              payload: productInDB,
            },
          };
        }

        totalAmount += productInDB.price * cartProduct.quantity;
        productInDB.stock -= cartProduct.quantity;
        await productInDB.save();

        productsInCart.push({
          product: {
            id: productInDB._id,
            title: productInDB.title,
            price: productInDB.price,
          },
          quantity: cartProduct.quantity,
        });
      }

      function generateRandomNumber() {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
      
      const randomNumber = generateRandomNumber();
      console.log(randomNumber);

      const ticket = new Ticket ({
        code: randomNumber,
        amount: totalAmount,
        purchaser: purchaser,
        products: productsInCart,
      });
console.log("ticket final", ticket)
      await ticket.save();

      return {
        code: 200,
        result: {
          status: 'success',
          message: 'Purchase successful',
          payload: ticket,
        },
      };
    } catch (error) {
      console.log("500")
      console.log(error);
      return {
        code: 500,
        result: {
          status: 'error',
          message: 'Couldn\'t purchase products.',
        },
      };
    }
  }
}

module.exports = TicketService;
