const TicketModel = require("../models/tickets.model")

class TicketsDao {
    async createTicket(purchaser, amount) {
      const code = shortid.generate();
      return await TicketModel.create({ purchaser, amount, code });
    }
  }
  
  const ticketsDao = new TicketsDao();
  module.exports = ticketsDao;
