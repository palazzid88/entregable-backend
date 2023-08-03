const { paginate } = require("mongoose-paginate-v2");
const { ProductModel } = require("../models/products.model");

class ProductDao {
  async validate(title, description, price, thumbnail, code, stock, status, category) {
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

    const queryResult = await ProductModel.paginate(queryOptions, options);

    const { docs, ...rest } = queryResult;

    let products = docs.map((doc) => {
      return {
        title: doc.title,
        description: doc.description,
        price: doc.price,
        thumbnail: doc.thumbnail,
        category: doc.category,
        id: doc._id.toString(),
      };
    });

    const data = {
      products: products,
      pagination: rest,
    };

    return data;
  }

  async createOne(title, description, price, thumbnail, code, stock, status, category) {
    this.validate(title, description, price, thumbnail, code, stock, status, category);
    const productCreated = await ProductModel.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });
    return productCreated;
  }

  async updateOne(id, title, description, price, thumbnail, code, stock, status, category) {
    this.validate(title, description, price, thumbnail, code, stock, status, category);
    const productUpdated = await ProductModel.findOneAndUpdate(
      { _id: id },
      {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      },
      { new: true }
    );
    return productUpdated;
  }

  async deleteOne(id) {
    const productDeleted = await ProductModel.findOneAndRemove({ _id: id });
    return productDeleted;
  }

  async findOne(productId) {
    console.log("ingreso al fineOne")
    const product = await ProductModel.findById(productId);
    console.log(product)
    return product;
  }
}

const productDao = new ProductDao();
module.exports = productDao;
