const express = require('express');
const sessionsRouter = express.Router();
const passport = require('passport');
const sessionsController = require('../controllers/sessions.controller');


sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});
sessionsRouter.get('/current', sessionsController.currentSession)


module.exports = sessionsRouter;