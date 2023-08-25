const express = require('express');
const authRouter = express.Router();
const AuthController = require('../controllers/auth.controller');
const AuthService = require('../services/auth.service');
const { isUser, isAdmin } = require("../middlewares/auth")
const jwt = require('jsonwebtoken');


authRouter.get('/session', AuthController.getSession);

authRouter.get('/register', AuthController.getRegisterPage);

// Utilizamos la función register del servicio AuthService
authRouter.post('/register', AuthController.postRegister);
// authRouter.post('/register', AuthService.authenticateLogin, AuthController.postRegister);


authRouter.get('/failregister', AuthController.failRegister);

// Rutas sin cambios
authRouter.get('/login', AuthController.getLoginPage);
authRouter.post('/login', AuthService.authenticateLogin, AuthController.postLogin);
authRouter.get('/faillogin', AuthController.failLogin);
authRouter.get('/logout', AuthController.logout);
authRouter.get('/perfil', AuthController.getPerfilPage);
authRouter.get('/administracion',isUser, isAdmin, AuthController.getAdminPage);

//proviene del vinculo del email para el restablecimiento -- renderiza la pg de nueva contraseña
authRouter.get('/reset-password/:token', AuthController.renderResetPasswordPage);
//toma la contraseña nueva del formulario
authRouter.post('/reset-password/', AuthController.resetPassword);
//renderiza form para ingresar el mail para restablecer la contraseña
authRouter.get('/recovery', AuthController.renderRecovery);
authRouter.post('/recovery', AuthController.recoverPassword);



module.exports = authRouter;