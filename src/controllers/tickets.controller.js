const ticketService = require('../services/ticket.service.js');

class ticketController {
    async createTicket(req, res) {
        // try {
        //     const code = req.session.user,
        //     purchase_datetime = ,
        //     amount = ,
        //     purchaser = user.email,

        //     const ticket = await ticketService.createOne();
        //     console.log("ticket en service", ticket);
        //     return ticket;
        // } catch (e) {
        //     console.log(e);
        //     throw new Error("Error al crear un ticket :(");
        // }
    }
}

module.exports = new ticketController