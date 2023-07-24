const express = require('express');
const { Router } = require('express');
const homeRouter = express.Router();
const HomeController = require('../controllers/home.controller.js');
const path = "../products.json";



homeRouter.get('/', HomeController.getProducts );
   
module.exports = homeRouter;
