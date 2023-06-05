const { json } = require("express");
const fs = require("fs");

class CartManager {
    static = 1
    constructor (path) {
        this.path = 'cart.json'
    }

    async createCart() {
        try {
            let carts = await this.getProductsFromCarts();
            const cartId = Math.round(Math.random() * 1000000);
            const cartIdToString = cartId.toString()
            const cart = {
                id: cartIdToString,
                products: []
            };
            carts.push(cart);
            const cartString = JSON.stringify(carts, null, 2);
            await fs.promises.writeFile(this.path, cartString, err=> {
                if (err) {
                    return ('error')
                }
                return carts;
            })
        } catch (err) {
            return (err)
        }
    }

    async getProductsFromCarts() { //=> trae los objetos dentro del JSON cart.json
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

    async getCart(id) { //=> trae el JSON con todos los carritos
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(data);
            }
        } catch (error) {
            return(error);
        }
    }

    async getProductsToCartById (id) { //busca un carro con este ID
        try {
            const carts = await this.getCart(); //busca el archivo this.path y retorna el JSON
            const cart = carts.find((cart) => cart.id == id)
            if (!cart) {
                throw new Error(`No existe carrito con ID, ${id}`)
            }
            return cart
        } catch (error) {
            
        }
    }

    async addProductIdinCartId(cid, pid) {
        try {
          const carts = await this.getCart();
          const cartToUpdateIndex = carts.findIndex((cart) => cart.id == cid);
          if (cartToUpdateIndex == -1) {
            throw new Error(`No existe ningún carrito con el id ${cid}`);
          }
          const cart = carts[cartToUpdateIndex];
          const productIndex = cart.products.findIndex((product) => product.id == pid);
          if (productIndex !== -1) {
            // Si el producto ya existe en el carrito, aumentar la cantidad en 1
            cart.products[productIndex].quantity++;
          } else {
            // Si el producto no existe en el carrito, agregarlo al array de productos
            cart.products.push({
              id: pid,
              quantity: 1,
            });
          }
          await this.updateCartById(cid, cart);
        } catch (error) {
          console.error(error);
        }
      }
      
      async updateCartById(cid, cart) {
        try {
          const carts = await this.getCart();
          const index = carts.findIndex((cart) => cart.id == cid);
          if (index === -1) {
            throw new Error(`No existe ningún carrito con el id ${cid}`);
          }
          carts[index] = { ...cart };
          await this.saveProductsInCart(carts);
        } catch (error) {
          console.error(error);
        }
      }
      
    async saveProductsInCart(carts) {
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
