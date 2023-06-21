const express = require('express');
const authRouter = express.Router();
const UserModel = require('../DAO/models/users.models');
const { isAdmin, isUser } = require('../DAO/middlewares/auth');
const { createHash, isvalidPassword } = require('../utils');


authRouter.get('/login', (req, res) => {
  // Render the login form
  res.render('login');
});


authRouter.post('/login', async (req, res) => {
  // Handle the login form submission
  const { email, password } = req.body;
  console.log("req.body", req.body);
  if (!email || !password) {
    console.log("sin mail o pass");
    return res.status(401).render('error', { error: 'Wrong email or password' });
  }
  console.log("antes del try");
  try {
    const user = await UserModel.findOne({ email: email });
    console.log("user", user);

    if (user && isvalidPassword(password, user.pass)) {
      // Set session data
      req.session.email = user.email;
      req.session.isAdmin = user.isAdmin;
      return res.redirect('/auth/perfil')
    } else {
      console.log("la comparación es incorrecta");
      return res.status(401).render('error', {error: 'error en email o password'})
    }
  } catch (error) {
    // Handle any error that occurred during login
    console.log(error);
    res.status(500).render('error', { error: 'An error occurred during login' });
  }
});


authRouter.get('/register', (req, res) => {
  // Render the registration form
  res.render('register');
});


authRouter.post('/register', async (req, res) => {
  const { email, pass, firstName, lastName } = req.body;
  console.log("req.body", req.body);
  if (!email || !pass || !firstName || !lastName) {
    return res.status(400).render('error', { error: 'Please complete all the fields' });
  }
  console.log("pasa la validación");
  // Verificar si el campo "pass" está presente
  if (!pass) {
    return res.status(400).render('error', { error: 'Please enter a password' });
  }
  console.log("pasa la validación de pass, y sigue el await");
  try {
    await UserModel.create({ email: email, pass: createHash(pass), firstName: firstName, lastName: lastName, isAdmin: false });
    console.log("despues del await");
    req.session.email = email;
    req.session.isAdmin = false;
    console.log("antes del return del perfil");
    return res.redirect('/auth/perfil');
  }
   catch (e) {
    console.log(e);
    console.log("dentro del catch");
    return res.status(400).render('error', { error: 'Could not create new user. Please enter another email' });
  }
});


authRouter.get('/perfil', isUser, (req, res) => {
  const user = { email: req.session.email, isAdmin: req.session.isAdmin };
  return res.render('perfil', { user: user });
});


authRouter.get('/administracion', isUser, isAdmin, (req, res) => {
  return res.send('admin');
});

authRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', { error: "Session could not be closed" });
    }
    return res.redirect('/auth/login');
  });
});

module.exports = authRouter;









/*

const express = require('express');
const { Router } = require('express');
// const authMiddleware = require('../DAO/middlewares/auth');
// const { UserModel } = require('../DAO/models/users.models');
const UserModel = require('../DAO/models/users.models.js')
const session = require('express-session');
const { isAdmin, isUser } = require('../DAO/middlewares/auth')


const authRouter = Router();

authRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', { error: "Session could not be closed" });
    }
    return res.redirect('/auth/login');
  });
});

authRouter.get('/perfil', isUser, (req, res) => {
  const user = { email: req.session.email, isAdmin: req.session.isAdmin };
  return res.render('perfil', { user: user });
});

authRouter.get('/login', (req, res) => {
  return res.render('login', {});
});

authRouter.post('/login', async (req, res) => {
  const { email, pass } = req.body;
  if (!email || !pass) {
    return res.status(400).render('error', { error: 'Please complete all the fields' });
  }
  const usarioEncontrado = await UserModel.findOne({ email: email });
  if (usarioEncontrado && usarioEncontrado.pass == pass) {
    req.session.email = usarioEncontrado.email;
    req.session.isAdmin = usarioEncontrado.isAdmin;

    return res.redirect('/auth/perfil');
  } else {
    return res.status(401).render('error', { error: 'Wrong user/password' });
  }
});

authRouter.get('/register', (req, res) => {
  return res.render('register', {});
});

authRouter.post('/register', async (req, res) => {
  const { email, pass, firstName, lastName } = req.body;
  console.log("authRouter register", email, pass, firstName, lastName);
  if (!email || !pass || !firstName || !lastName) {
    console.log("falt un campo");
    return res.status(400).render('error', { error: 'Please complete all the fields' });
  }
  console.log("campos completos");
  try {
    console.log("entro en el try");
    await UserModel.create({ email: email, pass: pass, firstName: firstName, lastName: lastName, isAdmin: false });
    req.session.email = email;
    req.session.isAdmin = false;

    return res.redirect('/auth/perfil');
  } catch (e) {
    console.log(e);
    return res.status(400).render('error', { error: 'Could not create new user. Please enter another email' });
  }
});

module.exports = authRouter;
*/