const passport = require('passport');
const { RegisterDTO, LoginDTO } = require('../DAO/dto/auth.dto');
const UserModel = require('../DAO/mongo/models/users.model');

class AuthController {
  async getSession(req, res) {
    return res.send(JSON.stringify(req.session));
  }

  async getRegisterPage(req, res) {
    return res.render('register', {});
  }

  async postRegister(req, res, next) {
    passport.authenticate('register', { failureRedirect: '/auth/failregister' })(req, res, async (error) => {
      if (error) {
        // Manejar el error si es necesario
        return res.redirect('/auth/failregister');
      }
      
      try {
        // Buscar al usuario recién registrado en la base de datos
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
    return res.json({ error: 'fail to register' });
  }

  async getLoginPage(req, res) {
    return res.render('login', {});
  }

  async postLogin(req, res, next) {
    passport.authenticate('login', (err, user, info) => {
      console.log("user en postLogin auth.controller", user)
      if (err) {
        // Manejar el error...
        return res.status(500).render('error', { error: 'Error during login' });
      }
  
      if (!user) {
        // Renderizar la página de inicio de sesión con un mensaje de error...
        return res.render('login', { error: info.message });
      }
  
      // Establecer la sesión del usuario
      req.logIn(user, () => {
        // Redirigir después de establecer la sesión
        return res.redirect('perfil');
      });
    })(req, res, next);
  }
  

  async failLogin(req, res) {
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
      return res.render('perfil', { 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.role,
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
}

module.exports = new AuthController();