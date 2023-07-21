const express = require('express');
const authRouter = express.Router();
const AuthController = require('../controllers/auth.controller');
const AuthService = require('../services/auth.service');

authRouter.get('/session', AuthController.getSession);

authRouter.get('/register', AuthController.getRegisterPage);

// Utilizamos la función register del servicio AuthService
authRouter.post('/register', AuthService.register, AuthController.postRegister);

authRouter.get('/failregister', AuthController.failRegister);

// Rutas sin cambios
authRouter.get('/login', AuthController.getLoginPage);
authRouter.post('/login', AuthService.login, AuthController.postLogin);
authRouter.get('/faillogin', AuthController.failLogin);
authRouter.get('/logout', AuthController.logout);
authRouter.get('/perfil', AuthController.getPerfilPage);
authRouter.get('/administracion', AuthController.getAdminPage);

module.exports = authRouter;