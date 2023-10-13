const  ProductModel  = require("../models/products.model");


class ProductDao {

  async getAll(queryOptions, options) {
    try {
      const queryResult = await ProductModel.paginate(queryOptions, options);
      return queryResult;
    } catch (e) {
      throw e;
    }
  }

  async createOne(title, description, price, thumbnail, code, stock, status, category, owner){
    const productData = { title, description, price, thumbnail, code, stock, status, category, owner }
    // console.log("ingreso a createOne en products.dao")
    const product = new ProductModel(productData);
    await product.save();
    return product;
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
    console.log("delete one dao")
    const productDeleted = await ProductModel.findOneAndRemove({ _id: id });
    console.log("deleted", productDeleted)
    return productDeleted;
  }

  async findById(productId) {
    const id = productId.toString()
    const product = await ProductModel.findById(id);
    return product;
  }

  async find(owner) {
    console.log("owner en dao", owner)
    const products = await ProductModel.find(owner);
    return products;
  }
}

// const productDao = new ProductDao();
module.exports = ProductDao;
