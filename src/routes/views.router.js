const express = require('express')
const { Router } = require('express');
const viewsRouter = express.Router();
const { paginate } = require("mongoose-paginate-v2");
const CartService = require("../services/cart.service.js");
const ViewsController = require('../controllers/views.controller.js');

const cartService = new CartService();

viewsRouter.get("/", ViewsController.getAll );

module.exports = viewsRouter
