const express = require('express')
const { Router } = require('express');
const viewsRouter = express.Router();
const { paginate } = require("mongoose-paginate-v2");
const ProductService = require("../services/product.service.js");
const CartService = require("../services/cart.services.js");
// const { ProductModel } = require("../DAO/models/products.models.js");

const cartService = new CartService();
const Products = new ProductService();

viewsRouter.get("/", async (req, res) => {
    console.log("ingreso el el get de views")
    try {
      const { page, limit, sort, query } = req.query;
      const result = await Products.getAll(page, limit, sort, query);
      const products = result.products;
      const pagination = result.pagination;
      res.status(201).render("home", { products, pagination });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  });

module.exports = viewsRouter
