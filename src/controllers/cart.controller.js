const CartDao = require("../DAO/mongo/classes/carts.dao");
const ProductDao = require("../DAO/mongo/classes/products.dao");
const usersDao = require("../DAO/mongo/classes/users.dao");
const ProductModel = require("../DAO/mongo/models/products.model");
const UserModel = require("../DAO/mongo/models/users.model");
const CartService = require("../services/cart.service");
const ProductService = require("../services/product.service");
const TicketService = require("../services/tickets.service");
const UserService = require("../services/users.service");

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
            console.log("result", result);
            console.log("cart", cartId)
            return res.status(201).json({ message: "se creo un nuevo carrito", result })
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });            
        }
    }

    async viewCart(req, res) {
        console.log("ingresa al viewCart");
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
      
        } catch (error) {
          return res.status(500).json({ error: 'An error occurred while viewing the cart.' });
        }
    }
      
    async viewCheckout(req, res) {
        console.log('ingresó a viewcheckout')
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

            // return res.render('checkout-empty', { msg: "Tu carrito está vacío." });
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
        } catch (error) {
        console.error('Error en la página de checkout:', error);
        return res.status(500).render('error-500', { msg: "Error en la página de checkout" });
        }
    }
        
    async addToCart (req, res) {
        console.log("addToCart en cart.controller")
        try {
            const cid = req.params.cid.toString();
            const pid = req.params.pid.toString();
            const qty = parseInt(req.body.quantity) || 1;
            console.log("params:","cid:", cid,"pid:", pid,"qty:", qty)
    
            const result = await Carts.addToCart(cid, pid, qty);
            console.log("result", result)
            return res.status(201).json({ message: "producto añadido al carrito", result })
        } catch (e) {
            console.log(e)
            console.log("error capturado en el catch de addToCart")
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
        });
    }
    }

    async deleteProductToCart (req, res) {
        console.log("ingreso al delete product del cart");
        try {
            const cid = req.params.cid.toString();
            const pid = req.params.pid.toString();
            console.log("params", cid, pid)
    
            const result = await Carts.delProdToCart(cid, pid);
            console.log("result", result);
    
            return res.status(201).json({ message: "producto eliminado del carrito" })
        } catch (e) {
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
        });
        }
    }


    async clearCart (req, res) {
        try {
            console.log('ingreso en clear cart en cart.controller')
            const cid = req.params.cid
            console.log(cid)
            const result = await Carts.cleanToCart(cid);
            console.log('result', result)
            return res.status(201).json({ message: `se vació el carrito con ID: ${cid}` })
        } catch (e) {
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
        });
        }
    }


    async getCartById(req, res) {
        console.log("ingreso al getCartById");
        try {
            const user = req.session.passport.user;
            const userInDB = await UserModel.findById({ _id: user });
    
            if (!userInDB) {
                console.log("!userInDB");
                return res.status(400).json({ msg: "No existe usuario" }); // Agrega 'return' aquí
            }
    
            const cartId = userInDB.cart.toString();
            console.log("cartByUser", cartId);
            return res.status(201).json({ cartId });
        } catch (e) {
            return res.status(500).json({
                status: "error",
                msg: "Algo salió mal",
                data: {},
            });
        }
    } 


    async updateCart (req, res) {
        console.log("cart.controller updateCart")
        try {
            const cid = req.params.cid;
            const product = req.params.pid;
            const qty = req.body.quantity;

            console.log('params', cid,product,qty)

            // console.log("params", cid, pid)
    
            const result = await Carts.updateProductQuantity(cid, product, qty);
            console.log("result", result)
            return res.status(201).json({ message: `carro actualizado satisfactoriamente` })
        } catch (e) {
            return res.status(500).json({
                status: "error",
                msg: "Algo salió mal",
                data: {},
            });
        }
    }


    async addProduct (req, res) {
        console.log("ingreso al post de cart Router")
        try {
            const cid = req.params.cid.toString();
            const pid = req.params.pid.toString();
            const qty = req.body.quantity.toString();
            console.log(cid, pid)
            const result = await Carts.addProduct(cid, pid, qty);
            console.log("result", result);
            return res.status(201).json({ message: `carro actualizado satisfactoriamente` })
        } catch (e) {
            return res.status(500).json({
                status: "error",
                msg: "Algo salió mal",
                data: {},
            });
        }
    }


    async purchaseCart(req, res) {
        try {
            console.log("ingresó a purchaseCart en cart.controller")
          const cartId = req.params.cid;
          const purchaserId = req.session.passport.user;
          const purchaser = await usersDao.findOne({ _id: purchaserId });
      
          // Obtener el carrito y sus productos
          const cart = await cartDao.findById(cartId);
          console.log("cart", cart)
      
          if (!cart) {
            console.log("carro no encontrado")
            return res.status(404).json({ error: 'Carrito no encontrado' });
          }
      
          const cartProducts = cart.products;
          console.log("cartProducts", cartProducts)
      
          // Filtrar los productos que no pudieron ser comprados
          const productsPurchased = [];
          const productsNotPurchased = [];
      
          for (const cartProduct of cartProducts) {
            const productInDB = await productDao.findById(cartProduct.productId);
      
            if (!productInDB) {
              return res.status(404).json({ error: `Producto no encontrado con ID: ${cartProduct.productId}` });
            }
      
            if (productInDB.stock >= cartProduct.quantity) {
                console.log('tiene stock')
              // El producto tiene suficiente stock, restar la cantidad del stock
              productInDB.stock -= cartProduct.quantity;
              await productInDB.save();
              productsPurchased.push(cartProduct); // Agregar el producto comprado
            } else {
                console.log('no tiene stock')
              // El producto no tiene suficiente stock, dejarlo en el carrito
              productsNotPurchased.push(cartProduct);
            }
          }
      
          // Actualizar el carrito solo con los productos que no pudieron ser comprados
          cart.products = productsNotPurchased;
          await cart.save();
      
          // Crear un ticket de compra utilizando el servicio de tickets
          const ticketResult = await ticketService.purchase(purchaser.email, productsPurchased);
          console.log('ticketResult', ticketResult)
          const ticketRender = ticketResult.result
          console.log("ticket Render", ticketRender);
          const ticketRender3 = ticketResult.result.payload.toObject()
          console.log('render3', ticketRender3)
          
          
          if (ticketResult.code === 200) {
            console.log('status 200')
            return res.render('ticket', { ticket: ticketRender3});
            // return res.status(200).json({ message: 'Compra exitosa', ticket: ticketResult.result.payload });
          } else {
            console.log('status != 200')
            return res.status(ticketResult.code).json({ error: 'Error en la compra', details: ticketResult.result.message });
          }
        } catch (error) {
            console.log('error catch')
          console.error(error);
          return res.status(500).json({ error: 'Error en la compra' });
        }
      }
    }

    module.exports = new CartController();