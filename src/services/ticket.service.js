const TicketModel = require('../DAO/mongo/models/tickets.model.js');

class ticketController {
    async createOne() {
        try {
            const ticket = await TicketModel.create({});
            console.log("ticket en service createOne", ticket);
            return ticket;
        } catch (e) {
            console.log(e);
            throw new Error("Error al crear ticket :(");
        }
    }
}

module.exports = new ticketController