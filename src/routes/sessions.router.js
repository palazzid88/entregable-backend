const express = require('express');
const sessionsRouter = express.Router();
const passport = require('passport');


sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  req.session.user = req.user;
  // Successful authentication, redirect home.
  res.redirect('/');
});

sessionsRouter.get('/show', (req, res) => {
  return res.send(JSON.stringify(req.session));
});



module.exports = sessionsRouter;