const ProductDao = require("../DAO/mongo/classes/products.dao");
const productDao = new ProductDao();

class ProductService {
  async validate(title, description, price, thumbnail, code, stock, status, category) {
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !status ||
      !category
    ) {
      throw new Error("Validation error: Please complete all product fields.");
    }
  }

  async getAll(page, limit, sort, query) {
    const options = {
      page: page || 1,
      limit: limit || 5,
      sort: sort || "asc",
    };

    const queryOptions = {};

    if (query) {
      queryOptions.category = query;
    }

    const queryResult = await productDao.getAll(queryOptions, options);

    const { docs, ...rest } = queryResult;

    let products = docs.map((doc) => {
      return {
        title: doc.title,
        description: doc.description,
        price: doc.price,
        thumbnail: doc.thumbnail,
        category: doc.category,
        id: doc._id.toString()
      };
    });

    const data = {
        products: products,
        pagination: rest
    }

    return data;
  }

  async addProduct(prod) {
      const productCreated = await productDao.createOne(
        prod.title,
        prod.description,
        prod.price,
        prod.thumbnail,
        prod.code,
        prod.stock,
        prod.status,
        prod.category,
        prod.owner
      );
  
      return productCreated;
    }

  async updateOne(id, productData) {
    this.validate(
      productData.title,
      productData.description,
      productData.price,
      productData.thumbnail,
      productData.code,
      productData.stock,
      productData.status,
      productData.category
    );

    const productUpdated = await productDao.updateOne(id, productData);
    return productUpdated;
  }

  async deleteOne(id) {
    const productDeleted = await productDao.deleteOne(id);
    return productDeleted;
  }

  async getProductById(id) {
    const product = await productDao.findById(id);
    return product
  }

  async getProductsByOwner(prodOwner) {
    const products = await productDao.find({ owner: prodOwner })
    return products
  }
}

module.exports = ProductService;
