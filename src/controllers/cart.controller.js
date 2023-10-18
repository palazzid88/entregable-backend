const CartDao = require("../DAO/mongo/classes/carts.dao");
const ProductDao = require("../DAO/mongo/classes/products.dao");
const usersDao = require("../DAO/mongo/classes/users.dao");
const ProductModel = require("../DAO/mongo/models/products.model");
const UserModel = require("../DAO/mongo/models/users.model");
const CartService = require("../services/cart.service");
const ProductService = require("../services/product.service");
const TicketService = require("../services/tickets.service");
const UserService = require("../services/users.service");
const productsController = require("./products.controller");
const mailer = require('../services/mailing.service'); // Importa tu servicio de envío de correo


const userService = new UserService();
const productModel = new ProductModel()
const ticketService = new TicketService()

const Carts = new CartService;
const cartDao = new CartDao
const productDao = new ProductDao

let productsWithQuantity;
let total;
let cartTotal;

class CartController {
    async createCart (req, res) {
        try {
            const result = await Carts.createOne()
            const cartId = result._id.toString();
            return res.status(201).json({ message: "se creo un nuevo carrito", result })
        }
        catch (e) {
          logger.error('Ocurrió un error en la función createCart:', e)
          return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });            
        }
    }

    async viewCart(req, res) {
        try {
          const userId = req.session.passport.user;      
          const user = await UserModel.findOne({ _id: userId });
      
          if (!user) {
            res.render('error-404', {msg: "User not found"});
          }
      
          const cartId = user.cart;
      
          if (!cartId) {
            res.render('error-404', {msg: "User not found"});
          }
      
          const cart = await Carts.getCartWithProducts(cartId);
      
          if (!cart) {
            res.render('error-404', {msg: "User not found"});
          }
      
          let message = "";
          if (cart.products.length === 0) {
            message = "Tu carrito está vacío.";
          }
      
          const productIds = cart.products.map(product => product.productId);
          const products = await ProductModel.find({ _id: { $in: productIds } });
      
          productsWithQuantity = cart.products.map(cartProduct => {
            const productDetails = products.find(product => product._id.toString() === cartProduct.productId.toString());
            total = cartProduct.quantity * productDetails.price;
            return {
              product: productDetails.toObject(),
              quantity: cartProduct.quantity,
              total,
            };
          });
      
          // Calcula el total del carrito sumando los totales por producto
          cartTotal = productsWithQuantity.reduce((total, product) => {
            return total + product.total;
          }, 0);
      
          res.render('cart', { prodToCart: productsWithQuantity, message, cart: cartId, cartTotal });
      
        } catch (e) {
          logger.error('Ocurrió un error en la función viewCart:', e)
          return res.status(500).json({ error: 'An error occurred while viewing the cart.' });
        }
    }
      
    async viewCheckout(req, res) {
        try {
        const userId = req.session.passport.user;
    
        const user = await UserModel.findOne({ _id: userId });
    
        if (!user) {
            return res.status(404).render('error-404', { msg: "User not found" });
        }
    
        const cartId = user.cart;
    
        if (!cartId) {
            return res.status(404).render('error-404', { msg: "User does not have a cart" });
        }
    
        const cart = await Carts.getCartWithProducts(cartId);
    
        if (!cart) {
            return res.status(404).render('error-404', { msg: "Cart not found" });
        }
    
        // Verifica si el carrito está vacío
        if (cart.products.length === 0) {
            return res.status(201).json({ message: "carro vacío", result })
        }
    
        const productIds = cart.products.map(product => product.productId);
        const products = await ProductModel.find({ _id: { $in: productIds } });
    
        productsWithQuantity = cart.products.map(cartProduct => {
            const productDetails = products.find(product => product._id.toString() === cartProduct.productId.toString());
            total = cartProduct.quantity * productDetails.price;
            return {
            product: productDetails.toObject(),
            quantity: cartProduct.quantity,
            total
            };
        });

        // Calcula el total del carrito sumando los totales por producto
        cartTotal = productsWithQuantity.reduce((total, product) => {
            return total + product.total;
          }, 0);
    
        return res.render('checkout', { productsWithQuantity, cartId, cartTotal});
        } catch (e) {
          logger.error('Ocurrió un error en la función viewCheckout:', e)
        return res.status(500).render('error-500', { msg: "Error en la página de checkout" });
        }
    }
        
    async addToCart (req, res) {
        try {
            const cid = req.params.cid.toString();
            const pid = req.params.pid;
            const qty = parseInt(req.body.quantity) || 1;

            const userEmail = req.user.email

            const productAdd = await ProductModel.findOne({ _id: pid })

            if (userEmail !== productAdd.owner) {
              const result = await Carts.addToCart(cid, pid, qty);
              return res.status(201).json({ message: "producto añadido al carrito", result });
          } else {
              res.status(201).json({ message: "no puede añadir al carrito un producto que haya sido creado por usted! :(" });
          }         
        } catch (e) {
          logger.error('Ocurrió un error en la función addToCart:', e)
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
        });
    }
    }

    async deleteProductToCart (req, res) {
        try {
            const cid = req.params.cid.toString();
            const pid = req.params.pid.toString();
    
            const result = await Carts.delProdToCart(cid, pid);
    
            return res.status(201).json({ message: "producto eliminado del carrito" })
        } catch (e) {
          logger.error('Ocurrió un error en la función deleteProductToCart:', e)
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
        });
        }
    }


    async clearCart (req, res) {
        try {
            const cid = req.params.cid
            const result = await Carts.cleanToCart(cid);
            return res.status(201).json({ message: `se vació el carrito con ID: ${cid}` })
        } catch (e) {
          logger.error('Ocurrió un error en la función clearCart:', e)
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
        });
        }
    }


    async getCartById(req, res) {
        try {
            const user = req.session.passport.user;
            const userInDB = await UserModel.findById({ _id: user });
    
            if (!userInDB) {
                return res.status(400).json({ msg: "No existe usuario" }); // Agrega 'return' aquí
            }
    
            const cartId = userInDB.cart.toString();
            return res.status(201).json({ cartId });
        } catch (e) {
          logger.error('Ocurrió un error en la función getCartById:', e)
            return res.status(500).json({
                status: "error",
                msg: "Algo salió mal",
                data: {},
            });
        }
    } 

    async updateCart (req, res) {
        try {
            const cid = req.params.cid;
            const product = req.params.pid;
            const qty = req.body.quantity;  
            const result = await Carts.updateProductQuantity(cid, product, qty);
            return res.status(201).json({ message: `carro actualizado satisfactoriamente` })
        } catch (e) {
          logger.error('Ocurrió un error en la función updateCart:', e)
            return res.status(500).json({
                status: "error",
                msg: "Algo salió mal",
                data: {},
            });
        }
    }

    async addProduct (req, res) {
        try {
            const cid = req.params.cid.toString();
            const pid = req.params.pid.toString();
            const qty = req.body.quantity.toString();
            const result = await Carts.addProduct(cid, pid, qty);
            return res.status(201).json({ message: `carro actualizado satisfactoriamente` })
        } catch (e) {
          logger.error('Ocurrió un error en la función addProduct:', e)
            return res.status(500).json({
                status: "error",
                msg: "Algo salió mal",
                data: {},
            });
        }
    }

    async purchaseCart(req, res) {
        try {
          const cartId = req.params.cid;
          const purchaserId = req.session.passport.user;
          const purchaser = await usersDao.findOne({ _id: purchaserId });
      
          // Obtener el carrito y sus productos
          const cart = await cartDao.findById(cartId);
      
          if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
          }

          const cartProducts = cart.products;
      
          // Filtrar los productos que no pudieron ser comprados
          const productsPurchased = [];
          const productsNotPurchased = [];
          const productsForMail = [];
      
          for (const cartProduct of cartProducts) {
            const productInDB = await productDao.findById(cartProduct.productId);
      
            if (!productInDB) {
              return res.status(404).json({ error: `Producto no encontrado con ID: ${cartProduct.productId}` });
            }
      
            if (productInDB.stock >= cartProduct.quantity) {
              // El producto tiene suficiente stock, restar la cantidad del stock
              productInDB.stock -= cartProduct.quantity;
              await productInDB.save();
              productsPurchased.push(cartProduct);
              productsForMail.push(productInDB)
            } else {
              // El producto no tiene suficiente stock, dejarlo en el carrito
              productsNotPurchased.push(cartProduct);
            }
          }
      
          // Actualizar el carrito solo con los productos que no pudieron ser comprados
          cart.products = productsNotPurchased;
          await cart.save();
      
          // Crear un ticket de compra utilizando el servicio de tickets
          const ticketResult = await ticketService.purchase(purchaser.email, productsPurchased);
          const ticketRender = ticketResult.result.payload.toObject()
          const userEmail = purchaser.email
          
          if (ticketResult.code === 200) {
            await mailer.sendPurchaseCompleted(userEmail, productsForMail);

            return res.render('ticket', { ticket: ticketRender});
            // return res.status(200).json({ message: 'Compra exitosa', ticket: ticketResult.result.payload });
          } else {
            return res.status(ticketResult.code).json({ error: 'Error en la compra', details: ticketResult.result.message });
          }
        } catch (error) {
          logger.error('Ocurrió un error en la función purchaseCart:', e)
          return res.status(500).json({ error: 'Error en la compra' });
        }
      }
    }

    module.exports = new CartController();