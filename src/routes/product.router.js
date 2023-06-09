const express = require('express');
const { Router } = require('express');
const productRouter = express.Router();

const ProductManager = require('../DAO/productManager');
const ProductModel = require('../DAO/models/products.models');
const path = "../products.json"
const  productManager = new ProductManager (path)


// traer todos los productos de mongo db
productRouter.get("/", async (req, res) => {
  try {
    const { page, limit, sort, query } = req.query
    const queryResult = await ProductModel.paginate({}, {limit: limit || 5, page: page || 1, sort: sort || asc})
    const { docs, ...rest } = queryResult;

    let products = docs.map((doc) => {
      return {title: doc.title, description: doc.description, price: doc.price, thumbnail: doc.thumbnail, category: doc.category}
    })

 console.log(rest)

    res.status(201).render("products", {products: products, pagination: rest})

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

//traer los products filtrado por id
productRouter.get('/:id', async (req, res)=> {
  try {
    const { id } = req.params;
    const products = await ProductModel.findById({ _id: id });
    console.log(products)
    if (!products) {
      res.status(404).json("producto no encontrado")
    } else {
      return res.status(200).json({
        status: "success",
        msg: "listado de productos",
        data: products,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
})

// añade nuevos productos a mongo db
productRouter.post("/", async (req, res) => {
  const { title, description, price, thumbnail, code, stock, status, category } = req.body;
  try {
    if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
      console.log(
        "validation error: please complete firstName, lastname and email."
      );
      return res.status(400).json({
        status: "error",
        msg: "please complete firstName, lastname and email.",
        data: {},
      });
    }
    const productCreated = await ProductModel.create({ title, description, price, thumbnail, code, stock, status, category });
    return res.status(201).json({
      status: "success",
      msg: "user created",
      data: productCreated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

// elimina un producto de mongo db
productRouter.delete('/:id', async (req, res) =>{
  try {
    const { id } = req.params;
    const productDeleted = await ProductModel.deleteOne({_id: id });
    return res.status(200).json({
      status: "success",
      msg: "user deleted",
      data: { productDeleted },
    });
  } catch (e) {
    console.log(e);
  return res.status(500).json({
    status: "error",
    msg: "something went wrong :(",
    data: {},
  });
}
})

// modifica un producto de mono db
productRouter.put("/:id", async (req, res) => {
  try {
  const { id } = req.params;
  const { title, description, price, thumbnail, code, stock, status, category } = req.body;
    if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
      console.log(
        "validation error: please complete all items."
      );
      return res.status(400).json({
        status: "error",
        msg: "please complete all items",
        data: {},
      });
    }
    const userUptaded = await ProductModel.updateOne(
      { _id: id },
      { title, description, price, thumbnail, code, stock, status, category }
    );
    return res.status(201).json({
      status: "success",
      msg: "product uptaded",
      data: { _id: id, title, description, price, thumbnail, code, stock, status, category },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});


/* Aquí debajo se encuentra el código antiguo de productRouter con Fyle System */

// productRouter.get('/', async (req, res) => {
//     try {
//         const { limit } = req.query;
//           const products = await productManager.getProducts()
//           if (limit) {
//             res.status(200).json(products.slice(0, limit));
//           } else {
//             res.status(200).json(products);
//           }
//       } catch (error) {
//             res.status(500).json({ message: 'hubo un error'})    
//       }
// })

// productRouter.get('/:id', async (req, res) => {
//     try {
//         const { id } = req.params; //=> este dato devuelve un string
//         const products = await productManager.getProductById(id)
//         if (!products) {
//           res.status(404).json("producto no encontrado")
//         } else {
//           res.status(200).json(products)
//         }    
//       } catch (error) {
//         res.status(500).json({message: 'error id'})
//       }
// })

// productRouter.post('/', async (req, res) => {
//   try {
//     const data = req.body
//     const product = await productManager.addProduct(data)
//     res.status(201).json({
//       success: true,
//       payload: product
//     })    
//   } catch (error) {
//       res.status(500).json({ message: "error" })    
//   }
// })

// productRouter.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = req.body;
//     const products = await productManager.getProductById(id);
//     if (!products) {
//       res.status(404).json({ message: 'no existe producto con ese ID' })      
//     }
//     else{
//       const prodUpdt = await productManager.updateProduct(id, data);
//       res.status(201).json({
//         succes: true,
//         message: `Producto con ID:${id} actualizado con éxito` 
//       })
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: `no existe producto ese ID`})
//   }
// }), 

// productRouter.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params
//     const products = await productManager.deleteProduct(id)
//       res.status(201).json({
//         succes: true,
//         message: `Se ha eliminado el producto con ID:${id}`
//       })
//     }
//    catch (error) {
//       res.status(500).json({message: 'error en ID'})
//   }
// })

module.exports = productRouter;

