const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/users.controller');
const multerConfig = require('../multer.config');
const { isAdmin } = require('../middlewares/auth');
const userController = new UserController


userRouter.get('/users', userController.getAllUsers)
userRouter.get('/users/premium/:uid', userController.togglePremiumUser);
userRouter.get('/users/:uid/uploadDocument', userController.uploadForm)
userRouter.post('/users/:uid/documents', multerConfig.single('document'), userController.uploadDocument);
userRouter.delete('/users', isAdmin, userController.deleteOldUsers)

module.exports = userRouter;
