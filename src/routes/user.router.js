// users.router.js
const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/users.controller');
const multerConfig = require('../multer.config');
const userController = new UserController


userRouter.get('/users', userController.getAllUsers)
userRouter.get('/users/premium/:uid', userController.togglePremiumUser);
userRouter.get('/users/:uid/uploadDocument', userController.uploadForm)
userRouter.post('/users/:uid/documents', multerConfig.single('document'), userController.uploadDocument);

module.exports = userRouter;
