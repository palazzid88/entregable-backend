const ProductManager = require('../DAO/memory/productManager.js');
const productManager = new ProductManager('../product.json');

class HomeService {
    async getProducts() {
        try {
            const products = await productManager.getProducts();
            return products
        }
        catch (e) {
            logger.error('Ocurrió un error en la función getProducts:', e)
            throw new Error("Error al traer los productos :(");
        }
    }
}

module.exports = new HomeService
