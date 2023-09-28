const passport = require('passport');
const { RegisterDTO, LoginDTO, userDTO } = require('../DAO/dto/auth.dto');
const UserModel = require('../DAO/mongo/models/users.model');
const crypto = require('crypto');
const mailer = require('../services/mailing.service'); // Importa tu servicio de envío de correo
const { createHash } = require('../utils/utils');


// para recuperación de contraseña
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

class AuthController {
  async getSession(req, res) {
    const userId = req.user;
    console.log("userId", userId)
    console.log("entro a getSession")
    // Comprueba si el usuario está autenticado.
    if (req.isAuthenticated()) {
      console.log("se autentico")
      // Obtén el ID de usuario almacenado en la sesión.

      // Consulta la base de datos u otro sistema de almacenamiento para obtener los datos completos del usuario.
      const user = await UserModel.findById(userId);

      // Devuelve los datos del usuario en la respuesta.
      return res.status(200).json(user);
    } else {
      // El usuario no está autenticado, puedes manejarlo de acuerdo a tus necesidades.
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
  
        // Establecer la sesión con los datos del usuario
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
        // Manejar el error...
        return res.status(500).render('error', { error: 'Error during login' });
      }
  
      if (!user) {
        // Renderizar la página de inicio de sesión con un mensaje de error...
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
        // Guardar los cambios en la base de datos
        await user.save();
  
        // Establecer la sesión del usuario
        req.logIn(user, () => {
          // Redirigir después de establecer la sesión
          return res.redirect('perfil');
        });
      } catch (saveErr) {
        // Manejar el error al guardar la fecha de última conexión...
        return res.status(500).render('error', { error: 'Error updating last_connection' });
      }
    })(req, res, next);
  }
  

  async failLogin(req, res) {
    return res.render('fail-login')
    return res.json({ error: 'invalid credentials' });
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
      console.log("user en getPerfilPage", user)
  
      if (!user) {
        // Si el usuario no está autenticado, redirige a la página de inicio de sesión
        return res.redirect('/auth/login');
      }
      
      // Renderiza la página de perfil y pasa los datos del usuario
      const userId = user._id.toString();
      console.log("userIden getPerfilPage", userId)
      return res.render('perfil', { 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.role,
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
      console.log("ingreso al 1er paso")
      return res.render('resetPage');
    } catch (error) {
      console.error('Error en el restablecimiento de contraseña:', error);
      return res.status(500).json({ error: 'Ha ocurrido un error en el restablecimiento de contraseña.' });
    }
  }
  


async recoverPassword(req, res) {
  try {
    console.log("ingreso al 2do paso")
    const { email } = req.body;
    const { JWT_SECRET } = process.env;
    const { password, password2 } = req.body

    console.log("user del req body", email)
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
    console.log("4 to paso")
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findOne({ email: decodedToken.email });

    if (!user) {
      // Aquí puedes manejar el caso si el usuario no existe
      return res.render('resetPassword', { error: 'Usuario no encontrado' });
    }
    console.log("4to paso render resetpassword")
    // Renderiza la página de restablecimiento de contraseña con el token
    res.render('resetPassword', { token });
  } catch (error) {
    // Manejo de errores en caso de que el token no sea válido
    res.render('resetPassword', { error: 'Token inválido' });
  }
};

async resetPassword(req, res) {
  try {
    console.log("5to paso reset-password luego de cargar la contraseña nueva")
    const { token, newPassword } = req.body;
    const { JWT_SECRET } = process.env;

    console.log("5to token", token);
    console.log("5to newpass", newPassword);
    console.log("5to JWT secret", JWT_SECRET)
    // Decodificar el token
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (decodedToken){
      console.log("5t paso decodedToken")
    }
    // Buscar al usuario por correo electrónico
    const user = await UserModel.findOne({ email: decodedToken.email });

    console.log("5to paso user", user)

    if (!user) {
      // Manejo si el usuario no existe
      return res.status(400).json({ message: 'Usuario no encontrado.' });
    }

    // Actualizar la contraseña del usuario
    user.password = createHash(newPassword);
    await user.save();

    console.log("5to paso user", user)

    // Responder con un mensaje de éxito
    return res.render('passwordResetSuccess')
    // return res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    console.error('Error en el restablecimiento de contraseña:', error);
    return res.status(500).json({ error: 'Ha ocurrido un error en el restablecimiento de contraseña.' });
  }
}

}

module.exports = new AuthController();