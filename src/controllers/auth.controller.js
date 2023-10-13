const passport = require('passport');
const { RegisterDTO, LoginDTO, userDTO } = require('../DAO/dto/auth.dto');
const UserModel = require('../DAO/mongo/models/users.model');
const crypto = require('crypto');
const mailer = require('../services/mailing.service');
const { createHash } = require('../utils/utils');


// Recuperar la contraseña
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

class AuthController {
  async getSession(req, res) {
    const userId = req.user;
    console.log("userId", userId)
    console.log("entro a getSession")
    // Comprobación de autenticación de usuario.
    if (req.isAuthenticated()) {
      console.log("se autentico")
      // Obtén el ID de usuario almacenado en la sesión.

      // Consulta en la db para obtener los datos completos del usuario.
      const user = await UserModel.findById(userId);

      // Devuelve los datos del usuario en la respuesta.
      return res.status(200).json(user);
    } else {
      // El usuario no está autenticado.
      console.log("no se autentico")
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
  }


  async getRegisterPage(req, res) {
    return res.render('register', {});
  }

  async postRegister(req, res, next) {
    passport.authenticate('register', { failureRedirect: '/auth/failregister' })(req, res, async (error) => {
      if (error) {
        return res.redirect('/auth/failregister');
      }
      
      try {
        const userCreated = await UserModel.findOne({ email: req.body.email });
  
        if (!userCreated) {
          console.log("User not found after registration");
          return res.redirect('/auth/failregister');
        }
  
        // Establecer la sesión con los datos del user
        req.login(userCreated, (error) => {
          if (error) {
            console.log("Error setting session after registration:", error);
            return next(error);
          }
          console.log("Session set after registration:", req.session);
          return res.redirect('/auth/perfil');
        });
      } catch (e) {
        console.log("Error finding user after registration:", e);
        return res.redirect('/auth/failregister');
      }
    });
  }
  

  async failRegister(req, res) {
    return res.render('fail-register')
  }

  async getLoginPage(req, res) {
    return res.render('login', {});
  }

  async postLogin(req, res, next) {
    passport.authenticate('login', async (err, user, info) => {
      console.log("user en postLogin auth.controller", user)
      if (err) {
        return res.status(500).render('error', { error: 'Error during login' });
      }
  
      if (!user) {
        // Renderizar la página de inicio de sesión con un mensaje de error.
        return res.render('login', { error: info.message });
      }
      
      // Guardar cartId en la sesión si el usuario tiene un carrito
      if (user.cart) {
        req.session.cartId = user.cart.toString();
        console.log("req.session.cartId en Login passport auth.controller", req.session.cartId);
      }
      
      // Actualizar la fecha de última conexión del usuario
      // en formato ISO 8601
      const currentDate = new Date();
      user.last_connection = currentDate;
  
      try {
        await user.save();
  
        req.logIn(user, () => {
          return res.redirect('perfil');
        });
      } catch (saveErr) {
        return res.status(500).render('error', { error: 'Error updating last_connection' });
      }
    })(req, res, next);
  }
  

  async failLogin(req, res) {
    return res.render('fail-login')
  }

  async logout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).render('error', { error: 'no se pudo cerrar su session' });
        }
        return res.redirect('/auth/login');
      })
    }
    catch (e) {
      console.log(e);
      return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
    }
  }

  async getPerfilPage(req, res) {
    try {
      // Aquí accedemos a la información del usuario autenticado a través de req.user
      const user = req.user;
      console.log("user", user)
  
      if (!user) {
        // Si el usuario no está autenticado, redirige a la página de inicio de sesión
        return res.redirect('/auth/login');
      }
      // creo una variable condicional para verificar los privilegios del user y pasarlos al render para utilizarlos en un  {{ #if }}
      let creator;
      // habilita las opciones de admin el render perfil
      let admin;
      let premium;
      // habilita el enlace para el cambio de role en el render perfil, (no debe ser admin)
      let notAdmin;

      // bolean para premium
      if (user.role === "premium") {
        premium = true
      } else {
        premium = false
      }

      // bolean para admin
      if (user.role === "admin") {
        admin = true
        notAdmin = !admin
      } else {
        admin = false
        notAdmin = !admin
      }
      
      // Renderiza la página de perfil y pasa los datos del usuario
      if(user.role === "premium" || user.role === "admin"){
        creator = true
      }else{
        creator = false
      }
      const userId = user._id.toString();
      return res.render('perfil', { 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        creator,
        premium,
        admin,
        notAdmin,
        userId,
       });
    } catch (e) {
      console.log("Error rendering perfil page:", e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  }
  
  async getAdminPage(req, res) {
    try {
      return res.send('Datos que solo puede ver si es administrador y si es usuario');
    }
    catch (e) {
      console.log(e);
      return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
    }
  }

  async renderRecovery(req, res) {
    try {
      return res.render('resetPage');
    } catch (error) {
      return res.status(500).json({ error: 'Ha ocurrido un error en el restablecimiento de contraseña.' });
    }
  }
  


async recoverPassword(req, res) {
  try {
    const { email } = req.body;
    const { JWT_SECRET } = process.env;
    const { password, password2 } = req.body

    if (password !== password2) {
      res.status(404).json({ message: "la contraseña no coincide" })
    }
    const user = await UserModel.findOne({ email });
    // Buscar al usuario por correo electrónico

    if (!user) {
      // El usuario no existe, muestra un mensaje genérico para evitar revelar información
      // res.render("send-message")
      return res.status(200).json({ message: 'Se ha enviado un correo de recuperación si el correo es válido.' });
    }

    // Genera el token JWT
    const jwtToken = jwt.sign({ email: user.email, userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const resetPasswordLink = `https://proyecto-backend-9f3q.onrender.com/auth/reset-password/${jwtToken}`;


    // Enviar el correo de recuperación
    await mailer.sendPasswordRecoveryEmail(user.email, resetPasswordLink);

    // Responder con un mensaje de éxito
    return res.render("send-message")

    // return res.status(200).json({ message: 'Se ha enviado un correo de recuperación si el correo es válido.' });
  } catch (error) {
    console.error('Error en la recuperación de contraseña:', error);
    return res.status(500).json({ error: 'Ha ocurrido un error en la recuperación de contraseña.' });
  }
}

async renderResetPasswordPage (req, res){
  const { token } = req.params;

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findOne({ email: decodedToken.email });

    if (!user) {
      // el user no existe
      return res.render('resetPassword', { error: 'Usuario no encontrado' });
    }
    // Renderiza la página de restablecimiento de contraseña con el token
    res.render('resetPassword', { token });
  } catch (error) {
    res.render('resetPassword', { error: 'Token inválido' });
  }
};

async resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    const { JWT_SECRET } = process.env;

    // Decodificar el token
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (decodedToken){
      console.log("5t paso decodedToken")
    }
    // Buscar al usuario por correo electrónico
    const user = await UserModel.findOne({ email: decodedToken.email });

    if (!user) {
      // si el usuer no existe
      return res.status(400).json({ message: 'Usuario no encontrado.' });
    }

    // Actualizar la contraseña del usuario
    user.password = createHash(newPassword);
    await user.save();

    // Responder con un mensaje de éxito
    return res.render('passwordResetSuccess')
  } catch (error) {
    console.error('Error en el restablecimiento de contraseña:', error);
    return res.status(500).json({ error: 'Ha ocurrido un error en el restablecimiento de contraseña.' });
  }
}

}

module.exports = new AuthController();