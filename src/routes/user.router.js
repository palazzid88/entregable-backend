// users.router.js
const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/users.controller');
const userController = new UserController

userRouter.get('/users/premium/:uid', userController.togglePremiumUser); 

module.exports = userRouter;
