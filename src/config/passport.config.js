const passport = require('passport');
const local = require('passport-local');
const { createHash, isValidPassword } = require('../utils');
const UserModel = require('../DAO/models/users.models');
const UserService = require('../services/users.service');
const userService = new UserService();
const LocalStrategy = local.Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const dotenv = require('dotenv');





function iniPassport() { 
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: '${process.env.GITHUB_CLIENT_ID',
        clientSecret: '${process.env.GITHUB_CLIENT_SECRET}',
        callbackURL: '${process.env.GITHUB_CALLBACK_URL}',
      },
      async (accesToken, _, profile, done) => {
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(new Error('cannot get a valid email for this user'));
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
            console.log('User Registration succesful');
            return done(null, userCreated);
          } else {
            console.log('User already exists');
            return done(null, user);
          }
        } catch (e) {
          console.log('Error en auth github');
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
        console.log(user);
        if (!user) {
          console.log('User Not Found with username (email) ' + username);
          return done(null, false);
        }
        if (!isValidPassword(password, user.password)) {
          console.log('Invalid Password');
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
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
          console.log("entro en passport");
          const { firstName, lastName, age } = req.body;
          console.log("req body en passport", req.body);
          let user = await UserModel.findOne({ email: username });
          console.log("user en passport", user);
          if (user) {
            console.log('User already exists');
            return done(null, false);
          }

          const newUser = {
            email: username,
            firstName,
            lastName,
            age: Number(age),
            role: "user",
            cart: null,
            password,
          };

          console.log("newUser", newUser)
          let userCreated = await userService.create(newUser);
          console.log("UserModel.create", userCreated);
          console.log('User Registration succesful');
          return done(null, userCreated);
        } catch (e) {
          console.log('Error in register');
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
    let user = await UserModel.findById(id);
    done(null, user);
  });
}

module.exports = iniPassport
