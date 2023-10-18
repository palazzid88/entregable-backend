// const { cartsDao, productsDao, usersDao } = require("../DAO/modelFactory.js");
const ProductDao = require("../DAO/mongo/classes/products.dao.js");
const ticketsDao = require("../DAO/mongo/classes/tickets.dao.js")
const CartDao = require("../DAO/mongo/classes/carts.dao.js");
const TicketService = require("./tickets.service.js");
const ticketService = new TicketService

const productDao = new ProductDao();
const cartDao = new CartDao();

class CartService {
    async createOne() {
        try {
            const cart = await  cartDao.create({});
            return cart;
        } catch (e) {
            logger.error('Ocurrió un error en la función createOne:', e)
            throw new Error("Error al crear un carro :(");
        }
    }

    async addToCart(cid, pid, qty) {
        try {
            const product = await productDao.findById(pid);

            if (!product) {
                throw `No existe producto con ID: ${pid}`;
            }

            const cart = await cartDao.findById(cid);
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
        } catch (e) {
            logger.error('Ocurrió un error en la función addToCart:', e)
            throw new Error("No se pudo eliminar producto del carro :(");
        };
    }

    async delProdToCart(cid, pid) {
        try {
            const productId = pid
            const cart = await cartDao.findById(cid);
            if (!cart) {
                throw (`no existe carro con ID: ${cid}`)
            }
            const prodIndex = cart.products.findIndex((product) => product.productId.toString() === productId );
            if (prodIndex === -1) {
                throw (`no existe prod con ID: ${pid}`)
            }
            cart.products.splice(prodIndex, 1);
    
            await cart.save(); 
            return cart; 
        }
        catch (e) {
            logger.error('Ocurrió un error en la función delProdToCart:', e)
            throw new Error("No se pudo eliminar producto del carro :(");
        };
    }
    
        
    async cleanToCart(cid) {
        try {
            const cart = await cartDao.findById(cid);
            if (!cart) {
                throw (`no existe carro con ID: ${cid}`)
            }
            cart.products = [];
            await cart.save()    
            return cart;
        }
        catch (e) {
            logger.error('Ocurrió un error en la función cleanToCart:', e)
            throw new Error("No se pudo eliminar el carro :(");
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await cartDao.findById(cid);
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
            logger.error('Ocurrió un error en la función updateProductQuantity:', e)
            throw new Error("No se pudo modificar la cantidad del producto :(");
        }        
    }

    async getCartById(cid) {
        try {
            const cart = await cartDao.findById(cid).populate('products.productId');
            const cartProduct = cart.products;
            if (!cart) {
                throw (`no existe carro con ID: ${cid}`)
            }
            return cart
        }
        catch (e) {
            logger.error('Ocurrió un error en la función getCartById:', e)
            throw new Error("No se pudo encontrar carro con ese ID :(");
        }        
    }

    async updateCart(cid, products) {
        try {
            const productUpdate = products;
            const cart = await cartDao.findById(cid);

            if (!cart) {
                throw (`no existe carro con ID: ${cid}`)
            }
            cart.products = productUpdate
            await cart.save();
    
            return cart
        }
        catch (e) {
            logger.error('Ocurrió un error en la función updateCart:', e)
            throw new Error("No se pudo actualizar carro :(");
        }      
    }

    async addProduct(cid, pid, qty){
        try {
            const product = await productDao.findById(pid);
            if (!product) {
                throw (`No existe producto con ID: ${pid}`)
            }

            const cart = await cartDao.findById(cid);
            if (!cart) {
                throw (`No existe carro con ID: ${cid}`)
            }
            const prodIndex = cart.products.findIndex((product) => product.productId.toString() === pid );
            if (prodIndex === -1) {
                cart.products.push({ productId: pid, quantity: qty })
            }else{
                cart.products[prodIndex].quantity += 1;
            }
            await cart.save();
            return  cart ;
        }
        catch (e) {
            logger.error('Ocurrió un error en la función addProduct:', e)
            throw new Error("No se pudo añadir producto al carro :(");
        }      
    }

    async getCartWithProducts(cartId) {
        try {
            const cart = await cartDao.findById(cartId);
            return cart;
        } catch (error) {
            logger.error('Ocurrió un error en la función getCartWithProducts:', e)
            throw new Error("No se pudo obtener el carrito :(");
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
    
            // Verificar el stock de los productos en el carrito
            const productsNotPurchased = [];
    
            for (const cartProduct of cartProducts) {
                const productInDB = await Product.findById(cartProduct.productId);
    
                if (!productInDB) {
                    return res.status(404).json({ error: `Producto no encontrado con ID: ${cartProduct.productId}` });
                }
    
                if (productInDB.stock < cartProduct.quantity) {
                    // El producto no tiene suficiente stock
                    productsNotPurchased.push(cartProduct.productId);
                }
            }
    
            if (productsNotPurchased.length > 0) {
                return res.status(422).json({ error: 'Algunos productos no pudieron ser comprados', productsNotPurchased });
            }
            return res.status(200).json({ message: 'Compra exitosa' });
        } catch (error) {
            logger.error('Ocurrió un error en la función purchaseCart:', e)
            return res.status(500).json({ error: 'Error en la compra' });
        }
    }
         
}

module.exports = CartService
