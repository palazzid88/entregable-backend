const express = require('express');
const ticketRouter = express.Router();
const ticketController = require('../controllers/tickets.controller');

// ticketRouter.get('/checkout', ticketController);

ticketRouter.get('/finishticket', ticketController.createTicket);

module.exports = ticketRouter;