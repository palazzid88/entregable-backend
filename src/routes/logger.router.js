const express = require('express')
const { Router } = require('express');
const loggerTestController = require('../controllers/loggerTest.controller');
const loggerRouter = express.Router();

loggerRouter.get('/loggerTest', loggerTestController.executeTest )

module.exports = loggerRouter

