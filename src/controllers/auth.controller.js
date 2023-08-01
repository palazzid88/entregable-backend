const passport = require('passport');
const { RegisterDTO, LoginDTO } = require('../DAO/dto/auth.dto');

class AuthController {
  async getSession(req, res) {
    return res.send(JSON.stringify(req.session));
  }

  async getRegisterPage(req, res) {
    return res.render('register', {});
  }

  async postRegister(req, res, next) {
    // Obtener los datos del formulario de registro
    const { firstName, lastName, email, age, password } = req.body;

    // Crear el DTO para el registro con los datos del formulario
    const registerDTO = new RegisterDTO(firstName, lastName, email, age, password);

    // Pasar el DTO al servicio de autenticación para el registro
    passport.authenticate('register', { failureRedirect: '/auth/failregister' })(req, res, next);
  }

  async failRegister(req, res) {
    return res.json({ error: 'fail to register' });
  }

  async getLoginPage(req, res) {
    return res.render('login', {});
  }

  async postLogin(req, res, next) {
    // Obtener los datos del formulario de inicio de sesión
    const { email, password } = req.body;

    // Crear el DTO para el inicio de sesión con los datos del formulario
    const loginDTO = new LoginDTO(email, password);

    // Pasar el DTO al servicio de autenticación para el inicio de sesión
    passport.authenticate('login', { failureRedirect: '/auth/faillogin' })(req, res, next);
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
      const user = req.session.user;
      return res.render('perfil', { user: user });
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