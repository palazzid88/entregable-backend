const CartModel = require("../DAO/models/carts.model");
const ProductModel = require("../DAO/models/products.model");

class CartService {
    async createOne () {
        try {
            const cart = await CartModel.create({})
            console.log("cart en service createOne", cart)
            return  cart 
        }
        catch (e) {
            console.log(e);
            throw new Error("Error al crear un carro :(");
        }
    }

    async addProdToCart (cid, pid, qty) {
        try {
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
        catch (e) {
            console.log(e);
            throw new Error("No se pudo eliminar producto del carro :(");
        };
    }

    async delProdToCart(cid, pid) {
        try {
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
        catch (e) {
            console.log(e);
            throw new Error("No se pudo eliminar producto del carro :(");
        };
    }
    
        
    async cleanToCart(cid) {
        try {
            const cart = await CartModel.findById(cid);
            if (!cart) {
                throw (`no existe carro con ID: ${cid}`)
            }
            cart.products = [];
            await cart.save()    
            return cart;
        }
        catch (e) {
            console.log(e);
            throw new Error("No se pudo eliminar el carro :(");
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
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
        catch (e) {
            console.log(e);
            throw new Error("No se pudo modificar la cantidad del producto :(");
        }        
    }

    async getCartById(cid) {
        try {
            console.log("ingreso a getCartById");
            const cart = await CartModel.findById(cid).populate('products.productId');
            console.log("cart en service", cart)
            const cartProduct = cart.products;
            if (!cart) {
                throw (`no existe carro con ID: ${cid}`)
            }
            return cart
        }
        catch (e) {
            console.log(e);
            throw new Error("No se pudo encontrar carro con ese ID :(");
        }        
    }

    async updateCart(cid, products) {
        try {
            const productUpdate = products;

            const cart = await CartModel.findById(cid);
            if (!cart) {
                throw (`no existe carro con ID: ${cid}`)
            }
            cart.products = productUpdate
            await cart.save();
    
            return cart
        }
        catch (e) {
            console.log(e);
            throw new Error("No se pudo actualizar carro :(");
        }      
    }

    async addProduct(cid, pid, qty){
        try {
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
        catch (e) {
            console.log(e);
            throw new Error("No se pudo añadir producto al carro :(");
        }      
    }
    


    
}
module.exports = CartService;