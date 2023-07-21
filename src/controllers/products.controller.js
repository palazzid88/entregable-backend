const ProductService = require('../services/product.service');

const Products = new ProductService();

class ProductController {
  async getAll(req, res) {
    try {
      const { page, limit, sort, query } = req.query;
      const result = await Products.getAll(page, limit, sort, query);
      const products = result.products;
      const pagination = result.pagination;

      res.status(201).render('products', { products, pagination });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const result = await Products.findOne(id);
      const product = result.product;

      if (!product) {
        return res.status(404).json('producto no encontrado');
      } else {
        return res.status(200).json({
          status: 'success',
          msg: 'listado de productos',
          data: product,
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  }

  async createProduct(req, res) {
    try {
      const {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      } = req.body;

      const result = await Products.createOne(
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category
      );
      const productCreated = result.productCreated;

      return res.status(201).json({
        status: 'success',
        msg: 'user created',
        data: productCreated,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await Products.deleteOne(id);
      const productDeleted = result.productDeleted;

      return res.status(200).json({
        status: 'success',
        msg: 'user deleted',
        data: { productDeleted },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      } = req.body;

      const product = await Products.findOne(id);
      if (!product) {
        return res.status(404).json('producto no encontrado');
      }
      const result = await Products.updateOne(
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category
      );
      const productUptaded = result;

      return res.status(201).json({
        status: 'success',
        msg: 'product uptaded',
        data: {
          productUptaded,
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
  }
}

module.exports = new ProductController();