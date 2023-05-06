const fs = require("fs");

class CartManager {
    static = 1
    constructor (path) {
        this.path = 'cart.json'
    }

    async createCart() {
        try {
            let carts = await this.getProductsFromCarts();
            console.log("leo el get ",carts);
            console.log(typeof carts)
            const cartId = Math.round(Math.random() * 1000000);
            const cart = {
                id: cartId,
                products: []
            };
            console.log("cart",cart)
            console.log(typeof cart)
            carts.push(cart);
            console.log("carts.push", carts)
            // console.log(typeof cartAdd)
            const cartString = JSON.stringify(carts, null, 2);
            await fs.promises.writeFile(this.path, cartString, err=> {
                if (err) {
                    return ('error')
                }
            })
        } catch (err) {
            return (err)
        }
    }

    async getProductsFromCarts() {
        try {
            if(fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8')
                return JSON.parse(data);
            }
            await fs.promises.writeFile(this.path, JSON.stringify([]))
        } catch (error) {
            return (error)
        }
    }

    async addToCart(product) {
        try {
            let cart = await this.getProductsToCart();
            this.id = products.length +1 ;
            product.id = this.id;
            let newProduct = {...product, ...product.id};
            products.push(newProduct);
            await this.saveProducts(products)
        } catch (error) {
            return(error) 
        }
    }

    async saveCarts(carts) {
        try {
            const data = JSON.stringify(carts, null, 2);
            await fs.promises.writeFile(this.path, data, err=> {
                if (err) {
                    return ('error')
                }
            })
        } catch (error) {
            return (error)
        }
    }
}

const cartManager = new CartManager("carts.json");

// const asyncFn = async ()=> {
//      await cartManager.createCart()
// }

// asyncFn()


module.exports = CartManager
