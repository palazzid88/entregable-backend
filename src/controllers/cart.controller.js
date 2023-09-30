const CartDao = require("../DAO/mongo/classes/carts.dao");
const ProductDao = require("../DAO/mongo/classes/products.dao");
const usersDao = require("../DAO/mongo/classes/users.dao");
const ProductModel = require("../DAO/mongo/models/products.model");
const UserModel = require("../DAO/mongo/models/users.model");
const CartService = require("../services/cart.service");
const ProductService = require("../services/product.service");
const UserService = require("../services/users.service");
const userService = new UserService();
const productModel = new ProductModel()

const Carts = new CartService;
const cartDao = new CartDao
const productDao = new ProductDao

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
            res.render('error-404', {msg: "User not found"})
            // return res.status(404).json({ error: 'User not found' });
          }
      
          const cartId = user.cart;
      
          if (!cartId) {
            res.render('error-404', {msg: "User not found"})
            // return res.status(404).json({ error: 'User does not have a cart' });
          }
      
          const cart = await Carts.getCartWithProducts(cartId);
      
          if (!cart) {
            res.render('error-404', {msg: "User not found"})
            // return res.status(404).json({ error: 'Cart not found' });
          }
      
          let message = "";
          if (cart.products.length === 0) {
            message = "Tu carrito está vacío.";
          }
      
          const productIds = cart.products.map(product => product.productId);
          const products = await ProductModel.find({ _id: { $in: productIds } });

          console.log("productIds", productIds);
          console.log("products", products)
      
          const productsWithQuantity = cart.products.map(cartProduct => {
            const productDetails = products.find(product => product._id.toString() === cartProduct.productId.toString());
            return {
              product: productDetails.toObject(),
              quantity: cartProduct.quantity
            };
          });
          
          console.log("productsWithQuantity", productsWithQuantity)
      
          res.render('cart', { prodToCart: productsWithQuantity, message, cart: cartId });
      
        } catch (error) {
          return res.status(500).json({ error: 'An error occurred while viewing the cart.' });
        }
      }

    // En el controlador de carritos (cart.controller.js)

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
            return res.render('checkout-empty', { msg: "Tu carrito está vacío." });
        }
    
        const productIds = cart.products.map(product => product.productId);
        const products = await ProductModel.find({ _id: { $in: productIds } });
    
        const productsWithQuantity = cart.products.map(cartProduct => {
            const productDetails = products.find(product => product._id.toString() === cartProduct.productId.toString());
            return {
            product: productDetails.toObject(),
            quantity: cartProduct.quantity
            };
        });
    
        // Renderiza la página de checkout con los productos y su cantidad
        return res.render('checkout', { productsWithQuantity, cartId});
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
        try {
            console.log("ingreso al delete");
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


    async clearCart (rea, res) {
        try {
            const cid = req.params.cid;
            const result = await Carts.cleanToCart(cid);
    
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
        try {
            const cid = req.params.cid;
            const products = req.body.products;
    
            const result = await Carts.updateCart(cid, products);
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
            const cartId = req.params.cid;
            const purchaserId = req.session.passport.user;
            const purchaser = await usersDao.findOne({ _id: purchaserId });
    
            // Obtener el carrito y sus productos
            const cart = await cartDao.findById(cartId);
    
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
    
            const cartProducts = cart.products;
            console.log("prod in cart cart.controller", cartProducts)
    
            // Verificar el stock de los productos en el carrito
            const productsNotPurchased = [];
    
            for (const cartProduct of cartProducts) {
                const productInDB = await productDao.findById(cartProduct.productId);
    
                if (!productInDB) {
                    return res.status(404).json({ error: `Producto no encontrado con ID: ${cartProduct.productId}` });
                }
    
                if (productInDB.stock < cartProduct.quantity) {
                    // El producto no tiene suficiente stock
                    productsNotPurchased.push(cartProduct.productId);
                }
            }
    
            if (productsNotPurchased.length > 0) {
                // Algunos productos no pudieron ser comprados
                // Puedes manejar esto de acuerdo a la lógica de tu aplicación, por ejemplo, eliminarlos del carrito
                // y devolverlos como parte de la respuesta
                return res.status(422).json({ error: 'Algunos productos no pudieron ser comprados', productsNotPurchased });
            }
    
            // Realizar la compra de los productos en el carrito
            // Esto debe restar el stock de los productos y generar un ticket
    
            // Después de la compra, actualiza el carrito para contener solo los productos que no pudieron ser comprados
            // Puedes eliminar los productos comprados del carrito
    
            // Devolver una respuesta exitosa
            return res.status(200).json({ message: 'Compra exitosa' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error en la compra' });
        }
    }
          
      

    async increaseQuantity (req, res) {
        try {
            console.log("ingresó al increase en controller");
            const cartId = req.params.cartId;
            console.log("cartId", cartId)
            // if (!cartId) {
            //     return res.status(400).json({ error: 'No se encontró el carrito en la sesión' });
            // }
            const productId = req.params.productId.toString();
            console.log("prodId", productId)

            const result = await Carts.increaseQuantity(cartId, productId);
            console.log("result", result)

            return res.status(200).json({ message: 'Cantidad aumentada', result });

        } catch (error) {
            return res.status(500).json({ error: 'Error al aumentar la cantidad' });         
        }

    }

    async decreaseQuantity(req, res) {
        try {
            console.log("ingreso en decrease")
            const cartId = req.params.cartId;
            console.log("decrease", cartId)
            // const cartId = req.session.cartId;

            // if (!cartId) {
            // return res.status(400).json({ error: 'No se encontró el carrito en la sesión' });
            // }

            const productId = req.params.productId.toString();

            const result = await Carts.decreaseQuantity(cartId, productId);

            return res.status(200).json({ message: 'Cantidad disminuida', result });
 
        } catch (error) {
          return res.status(500).json({ error: 'Error al disminuir la cantidad' });
        }
      }

    }


    module.exports = new CartController();