const ProductService = require("../services/product.service.js");
const Products = new ProductService();

class ViewsServices {
    async getAll (page, limit, sort, query) {
        try {
            const result = await Products.getAll (page, limit, sort, query);
            const products = result.products;
            const pagination = result.pagination;
            return { products, pagination } 
        } catch (error) {
            throw new Error("Error al obtener los productos y la paginación.");
        }
    }
}

module.exports = new ViewsServices