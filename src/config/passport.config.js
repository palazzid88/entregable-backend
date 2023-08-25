const passport = require('passport');
const local = require('passport-local');
const { createHash, isValidPassword } = require('../utils/utils');
const UserModel = require('../DAO/mongo/models/users.model');
const UserService = require('../services/users.service');
const CartService = require('../services/cart.service');
const logger = require('../utils/logger');
const cartService = new CartService
const userService = new UserService();
const LocalStrategy = local.Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();



function iniPassport() { 
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, _, profile, done) => {
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accessToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);
  
          if (!emailDetail) {
            logger.info('Cannot get a valid email for this user for GIthub strategy')
            return done(new Error('Cannot get a valid email for this user'));
          }
          profile.email = emailDetail.email;
  
          let user = await UserModel.findOne({ email: profile.email });
  
          if (!user) {
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              isAdmin: false,
              password: 'nopass',
            };
            let userCreated = await UserModel.create(newUser);
  
            // Crear el carrito para el nuevo usuario
            const newCart = await cartService.createOne();
            userCreated.cart = newCart._id;
            await userCreated.save();

             // Guardar el ID del carrito en la sesión
             req.session.cartId = newCart._id.toString();

            logger.info('user Registration successful')
            console.log('User Registration successful');
            return done(null, userCreated);


          } else {
            logger.info('User already exists')
            console.log('User already exists');
  
            // Si el usuario ya existe pero no tiene un carrito, crearlo
            if (!user.cart) {
              const newCart = await cartService.createOne();
              user.cart = newCart._id;
              await user.save();
  
              // Guardar el ID del carrito en la sesión
              req.session.cartId = newCart._id.toString();
            }else {
              // Si el usuario ya tiene un carrito, guardar su ID en la sesión
              req.session.cartId = user.cart.toString();
            }
  
            return done(null, user);
          }
        } catch (e) {
          logger.info('Error en auth github')
          console.log(e);
          return done(e);
        }
      }
    )
  );
  


  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        const user = await UserModel.findOne({ email: username });
        if (!user) {
          logger.info('User Not Found with username (email): ' + username);
          return done(null, false, { message: 'User Not Found' });
        }
        if (!isValidPassword(password, user.password)) {
          logger.info('invalid password ' + username)
          return done(null, false, { message: 'Invalid Password' });
        }

        return done(null, user);
      } catch (err) {
        logger.error('Error during login:', err);
        return done(err);
      }
    })
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { firstName, lastName, age } = req.body;
          let user = await UserModel.findOne({ email: username });
          if (user) {
            logger.info('User already exists')
            return done(null, false);
          }

          // Crear el nuevo usuario:

          const newUser = {
            email: username,
            firstName,
            lastName,
            age: Number(age),
            role: "user",
            cart: null,
            password,
            isAdmin: false,   
          };

          let userCreated = await userService.create(newUser);
          logger.info('User Registration succesful')

          // Crea el carrito y le asigna su ID al usuario:
          const newCart = await cartService.createOne();
          userCreated.cart = newCart._id;
          await userCreated.save();

          return done(null, userCreated);
        } catch (e) {
          logger.error('error en la creación de un User')
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await UserModel.findById(id);
      done(null, user);
    } catch (err) {
      logger.error('error en deserializeUser en passport')
      done(err);
    }
  });
}

module.exports = iniPassport
