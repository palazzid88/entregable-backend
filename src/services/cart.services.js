const CartModel = require("../DAO/models/carts.models");
const ProductModel = require("../DAO/models/products.models");

class CartService {
    async createOne () {
        const cart = await CartModel.create({})
        console.log("cart en service createOne", cart)
        return  cart 
    }
    async addProdToCart (cid, pid, qty) {
        const product = await ProductModel.findById(pid);
        console.log("prod en services", product);

        if (!product) {
            throw `No existe producto con ID: ${pid}`;
        }

        const cart = await CartModel.findById(cid);
        console.log("cart en service", cart);
        if (!cart) {
            throw `No existe carro con ID: ${cid}`;
        }

        const prodIndex = cart.products.findIndex((product) => product.productId.toString() === pid);
        if (prodIndex === -1) {
            cart.products.push({ productId: pid, quantity: qty });
        } else {
            cart.products[prodIndex].quantity += 1;
        }

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
        console.log("operador", cart)
        const prodIndex = cart.products.findIndex((product) => product.productId.toString() === productId );
        console.log("prodIndex", prodIndex);
        if (prodIndex === -1) {
            throw (`no existe preod con ID: ${pid}`)
        }
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
    async addProduct(cid, pid, qty){
        console.log("ingreso a sddProduct en service");
        const product = await ProductModel.findById(pid);
        console.log("product por btn", product);
        if (!product) {
            console.log("no exite prod");
            throw (`No existe producto con ID: ${pid}`)
        }
        console.log("despues del if de prod");

        // product ? product : (() => { })();

        const cart = await CartModel.findById(cid);
        console.log("cart en service", cart);
        if (!cart) {
            console.log("no existe cart");
            throw (`No existe carro con ID: ${cid}`)
        }
        console.log("despues del if de cart");
        // cart ? cart : (() => { throw (`No existe carro con ID: ${cid}`) })();
        const prodIndex = cart.products.findIndex((product) => product.productId.toString() === pid );
        if (prodIndex === -1) {
            console.log("index =-1");
            cart.products.push({ productId: pid, quantity: qty })
            console.log("cart.products");
        }else{
            cart.products[prodIndex].quantity += 1;
            console.log("cart fin", cart);
        }
        console.log("desp del save", cart);
        await cart.save();
        return  cart ;
    }
    


    
}
module.exports = CartService;