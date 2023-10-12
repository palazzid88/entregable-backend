const { default: mongoose } = require('mongoose');
const ProductService = require('../services/product.service');
const ProductDao = require('../DAO/mongo/classes/products.dao');

const Products = new ProductService();

class ProductController {
  async getAll(req, res) {
    try {
      const { page, limit, sort, query } = req.query;
      const result = await Products.getAll(page, limit, sort, query);
      const products = result.products;
      const pagination = result.pagination;

      res.status(200).render("products-list", { products, pagination });
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
      console.log("entró getProdById prod.controller")
      const { pid } = req.params
      console.log("id", pid)
      // const prodId = id.toObject()
      // console.log("prodId", prodId)
      const result = await Products.getProductById(pid);
      console.log("result", result)
      

      if (!result) {
        console.log("if !result")
        return res.render('error', { error: 'Producto no encontrado' });
      } else {
        console.log("result si!")
        const product = result.toObject();
        console.log("product = result.toObject()", product)
        return res.render('product-detail', { product });
      }
    } catch (e) {
      console.log("catch")
      console.log(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        data: {},
      });
    }
}


  async viewForm(req, res) {
    const email = req.params.email;
    console.log("mail en form", email)
    try {
      // const { page, limit, sort, query } = req.query;
      const result = await Products.getAll();
      const products = result.products;
      console.log(products)
      // const pagination = result.pagination;

      res.status(200).render("add-products", { products});
      // res.status(200).json({ msg: "entró al viewform" })
      
    } catch (error) {
      res.status(400).json({ msj: "error" })
    }
  }

  async createProduct(req, res) {
    console.log("ingreso al createProduct de product.controller")
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

      const owner = req.user.email;
      console.log("owner", owner)
  
      const result = await Products.addProduct(
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
        owner
      );
  
      const productCreated = result.productCreated;
      console.log("productCreated en controller", productCreated)
  
      return res.status(201).json({
        status: 'success',
        message: 'Product created',
        data: productCreated,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong :(',
        data: {},
      });
    }
  }

  async deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Verificar si el usuario actual es admin
        const isAdmin = req.user?.isAdmin;

        // Verificar si el usuario actual es premium
        const isPremium = req.user?.premium;

        // Verificar si el usuario actual es el propietario
        const userOwner = req.user?.email;

        // Si el usuario es admin, premium o el propietario, puede eliminar el producto
        if (isAdmin || (isPremium && userOwner === product.owner)) {
            const result = await Products.deleteOne(id);
            const productDeleted = result.productDeleted;

            return res.status(200).json({
                status: 'success',
                msg: 'Product deleted',
                data: { productDeleted },
            });
        } else {
            return res.status(403).json({ error: 'No tiene los privilegios para realizar esta operación' });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 'error',
            msg: 'Something went wrong :(',
            data: {},
        });
    }
}




  async updateProduct(req, res) {
    try {
        const { productId } = req.params;
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

        const userRole = req.user.role;

        // Obtener el producto que se desea actualizar
        const product = await Products.getProductById(productId);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found',
                data: {},
            });
        }

        if (userRole === 'premium') {
            // Verificar si el producto pertenece al usuario premium
            if (product.owner !== req.user.email) {
                return res.status(403).json({
                    status: 'error',
                    message: 'You do not have permission to update this product',
                    data: {},
                });
            }
        }

        if (userRole === 'admin') {
            // Si el usuario es admin, puede actualizar cualquier producto
            // Aquí se realiza la actualización del producto sin restricciones
            const result = await Products.updateProduct(
                productId,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status,
                category
            );

            const productUpdated = result.productUpdated;

            return res.status(200).json({
                status: 'success',
                message: 'Product updated',
                data: productUpdated,
            });
        }

        // Si el usuario no es premium ni admin, se le niega el acceso
        return res.status(403).json({
            status: 'error',
            message: 'You do not have permission to update this product',
            data: {},
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong :(',
            data: {},
        });
    }
  }

}

module.exports = new ProductController();