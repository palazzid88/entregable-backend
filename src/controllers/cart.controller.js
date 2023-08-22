const usersDao = require("../DAO/mongo/classes/users.dao");
const ProductModel = require("../DAO/mongo/models/products.model");
const UserModel = require("../DAO/mongo/models/users.model");
const CartService = require("../services/cart.service");
const UserService = require("../services/users.service");
const userService = new UserService();
const productModel = new ProductModel()

const Carts = new CartService;

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
        try {
          // Obtener el ID del usuario autenticado desde la sesión
          const userId = req.session.passport.user;
          console.log("user en view", userId)
      
          // Buscar al usuario en la base de datos utilizando el ID
          const user = await UserModel.findOne({ _id: userId });
          console.log("user en view", user)
          
          if (!user) {
            // Manejar el caso si el usuario no se encuentra en la base de datos
            return res.status(404).json({ error: 'User not found' });
          }
      
          // Obtener el ID del carrito del usuario
          const cartId = user.cart;
      
          if (!cartId) {
            // Manejar el caso si el usuario no tiene un carrito
            return res.status(404).json({ error: 'User does not have a cart' });
          }
      
          // Obtener los detalles del carrito utilizando el servicio de carritos
          const cart = await Carts.getCartWithProducts(cartId);
      
          if (!cart) {
            // Manejar el caso si el carrito no se encuentra
            return res.status(404).json({ error: 'Cart not found' });
          }
      
          let message = "";
          if (cart.products.length === 0) {
            message = "Tu carrito está vacío.";
          }      


        const prodToCart = cart.products
        console.log("prodToCart", prodToCart)
          res.render('cart', { prodToCart, message });
      
        } catch (error) {
          return res.status(500).json({ error: 'An error occurred while viewing the cart.' });
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



    async getCartById (req, res) {
        console.log("ingreso al getCartById")
        try {
            const user = req.session.passport.user
            console.log("user de session en cart.controller", user);
            console.log(typeof user)
            const userInDB = await UserModel.findById({_id: user})
                if (!userInDB) {
                    console.log("!userInDB")
                    res.status(400).json( {msg: "no existe usuario"} )
                }
            const cartId = userInDB.cart
            console.log("cartByUser", cartId)
        return res.status(201).json( {cartId} );
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



    async purchaseCart (req, res) {
        console.log("ingresó a purchase")
        try {
            const cartId = req.params.cid;
            const purchaser = res.session.passport.email;
            console.log("purchaser", purchaser)
            const response = await Carts.purchase(purchaser, cartId);
            return res.status(response.code).json(response.result);
        
        } catch (e) {
            return res.status(500).json({
                status: "error",
                msg: "error en el purchaseCart",
                data: {},
            });
        }
    }
    }


    module.exports = new CartController();