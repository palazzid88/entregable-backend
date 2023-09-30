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
            console.log("cart en service createOne", cart);
            return cart;
        } catch (e) {
            console.log(e);
            throw new Error("Error al crear un carro :(");
        }
    }

    async addToCart(cid, pid, qty) {
        try {
            console.log("addToCart en cart.service", cid, pid, qty);

            console.log("en addToCart de cart.service");
            console.log(pid)
            const product = await productDao.findById(pid);
            console.log("prod en services", product);

            if (!product) {
                throw `No existe producto con ID: ${pid}`;
            }

            console.log("antes del cartDao en addToCArt")
            const cart = await cartDao.findById(cid);
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
        } catch (e) {
            console.log(e);
            throw new Error("No se pudo eliminar producto del carro :(");
        };
    }

    async delProdToCart(cid, pid) {
        try {
            console.log("ingreso al service")
            const productId = pid
            const cart = await cartDao.findById(cid);
            console.log("cart", cart)
            if (!cart) {
                throw (`no existe carro con ID: ${cid}`)
            }
            console.log("operador", cart)
            const prodIndex = cart.products.findIndex((product) => product.productId.toString() === productId );
            console.log("prodIndex", prodIndex);
            if (prodIndex === -1) {
                throw (`no existe prod con ID: ${pid}`)
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
            const cart = await cartDao.findById(cid);
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
            console.log(e);
            throw new Error("No se pudo modificar la cantidad del producto :(");
        }        
    }

    async getCartById(cid) {
        try {
            console.log("ingreso a getCartById", cid);
            const cart = await cartDao.findById(cid).populate('products.productId');
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

            const cart = await cartDao.findById(cid);
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
            const product = await productDao.findById(pid);
            console.log("product por btn", product);
            if (!product) {
                console.log("no exite prod");
                throw (`No existe producto con ID: ${pid}`)
            }
            console.log("despues del if de prod");

            // product ? product : (() => { })();

            const cart = await cartDao.findById(cid);
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

    async getCartWithProducts(cartId) {
        try {
            const cart = await cartDao.findById(cartId);
            return cart;
        } catch (error) {
            console.log(error);
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
    

    async increaseQuantity(cartId, productId) {
        try {
            console.log("ingreso al increase del service")
        const cart = await CartModel.findById(cartId);
        console.log("cart", cart)
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(product => product.productId.toString() === productId);
        console.log("prodIndex", productIndex)
        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }

        cart.products[productIndex].quantity++;

        await cart.save();

        return cart;
        } catch (error) {
            console.log("err")
        throw error;
        }
    }

    async decreaseQuantity(cartId, productId) {
        try {
            console.log("ingreso al decrease del service")
        const cart = await CartModel.findById(cartId);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(product => product.productId.toString() === productId);

        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }

        if (cart.products[productIndex].quantity > 1) {
            cart.products[productIndex].quantity--;
        } else {
            cart.products.splice(productIndex, 1);
        }

        await cart.save();

        return cart;
        } catch (error) {
        throw error;
        }
    }


      
}

module.exports = CartService
