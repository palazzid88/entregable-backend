const CartModel = require("../DAO/models/carts.models");
const ProductModel = require("../DAO/models/products.models");

class CartService {
    // async deleteOne (id) {

    // }
    async createOne () {
        const cart = await CartModel.create({})
        console.log("cart en service return", cart)
        return  cart 
    }
    async addProdToCart (cid, pid, qty) {
        const product = await ProductModel.findById(pid);
        console.log("prod en services", product);
        product ? product : (() => { throw (`No existe producto con ID: ${pid}`) })();

        const cart = await CartModel.findById(cid);
        console.log("cart en service", cart);
        cart ? cart : (() => { throw (`No existe carro con ID: ${cid}`) })();

        const prodIndex = cart.products.findIndex((product) => product.pid.toString() === pid );
        prodIndex === -1 ? cart.products.push({ productId: pid, quantity: qty }) :
        cart.products[prodIndex].quantity += 1;

        await cart.save();
        return cart;
    }
    async delProdToCart(cid, pid) {
        console.log("ingreso al service")
        const productId = pid
        const cart = await CartModel.findById(cid);
        console.log("cart", cart)
        if (!cart) {
            throw (`no existe carro con ID: ${cid}`)
        }
        // cart ? cart : (() => { throw (`No existe carro con ID: ${cid}`) })();
        console.log("operador", cart)
        const prodIndex = cart.products.findIndex((product) => product.productId.toString() === productId );
        console.log("prodIndex", prodIndex);
        if (prodIndex === -1) {
            throw (`no existe preod con ID: ${pid}`)
        }
        // prodIndex === -1 ? (() => { throw (`No existe producto con ID: ${pid} en carro con ID: ${cid}`)}) :
        cart.products.splice(prodIndex, 1);

        await cart.save(); 
        return cart; 
    }
    async cleanToCart(cid) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw (`no existe carro con ID: ${cid}`)
        }
        cart.products = [];
        await cart.save()

        return cart;
    }
    async updateProductQuantity(cid, pid, quantity) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw `No existe carrito con ID: ${cid}`;
        }
    
        const productIndex = cart.products.findIndex((product) => product.productId.toString() === pid);
        if (productIndex === -1) {
            throw `No existe producto con ID: ${pid} en el carrito con ID: ${cid}`;
        }
    
        cart.products[productIndex].quantity = quantity;
    
        await cart.save();
    
        return cart;
    }
    async getCartById(cid) {
        console.log("ingreso a getCartById");
        const cart = await CartModel.findById(cid).populate('products.productId');
        console.log("cart en service", cart)
        const cartProduct = cart.products;
        if (!cart) {
            throw (`no existe carro con ID: ${cid}`)
        }
        return cart
    }
    async updateCart(cid, products) {
        const productUpdate = products;

        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw (`no existe carro con ID: ${cid}`)
        }
        cart.products = productUpdate
        await cart.save();

        return cart
    }
    
}
module.exports = CartService;