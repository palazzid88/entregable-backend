const passport = require('passport');

class AuthService {
  // Función para realizar la autenticación con Passport
  async authenticateLogin(req, res, next) {
    passport.authenticate('login', { failureRedirect: '/auth/faillogin' })(req, res, next);
  }

  // Función para actualizar la sesión del usuario después del registro
  updateSession(req, user) {
    req.session.user = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      role: user.role,
      isAdmin: user.isAdmin
    };
  }
}

module.exports = new AuthService();