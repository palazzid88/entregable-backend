const ProductManager = require('../DAO/productManager.js');
const productManager = new ProductManager('../product.json');

class HomeService {
    async getProducts() {
        try {
            const products = await productManager.getProducts();
            console.log(products)
            return products
        }
        catch (e) {
            console.log(e);
            throw new Error("Error al traer los productos :(");
        }
    }
}

module.exports = new HomeService
