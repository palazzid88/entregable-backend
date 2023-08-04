const CartService = require("../services/cart.service");

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
    
    async addToCart (req, res) {
        console.log("addToCart en cart.controller")
        try {
            const cid = req.params.cid.toString();
            const pid = req.params.pid.toString();
            const qty = parseInt(req.body.quantity);
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
        try {
        const cid = req.params.cid;
        console.log("ingresó a get")
        const cart = await Carts.getCartById(cid);     
        console.log("cart en get", cart)        
        return res.status(201).json(cart);
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
            const cartID = req.params.cid;
            const response = await Carts.purchase(req.session.user?.email, cartID);
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