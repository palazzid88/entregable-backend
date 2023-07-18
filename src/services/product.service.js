const { paginate } = require("mongoose-paginate-v2");
const ProductModel = require("../DAO/models/products.model");

class ProductService {
  async validate(
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
    category
  ) {
    //"validar los atributos del producto"
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
      console.log(
        "validation error: please complete firstName, lastname and email."
      );
      return res.status(400).json({
        status: "error",
        msg: "please complete firstName, lastname and email.",
        data: {},
      });
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

    const queryResult = await ProductModel.paginate(queryOptions, options);

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

    console.log('esto es rest', rest);
    console.log('esto es products', products)

    const data = {
        products: products,
        pagination: rest
    }

    return data;
  }
  async createOne(
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
    category
  ) {
    this.validate(
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category
    );
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
  } //cumplido
  async updateOne (id, title, description, price, thumbnail, code, stock, status, category) {
    this.validate(
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category
    );
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
      console.log("validation error: please complete all items.");
      return res.status(400).json({
        status: "error",
        msg: "please complete all items",
        data: {},
      });
    }
    const productUptaded = await ProductModel.updateOne(
      { title, description, price, thumbnail, code, stock, status, category }
    );
    return productUptaded;
  } //cumplido
  async deleteOne (id) {
    const productDeleted = await ProductModel.deleteOne({ _id: id });
    return productDeleted;
  }
  async findOne (_id) {
    const product = await ProductModel.findById({ _id: _id });
    return product
  }
}
module.exports = ProductService;