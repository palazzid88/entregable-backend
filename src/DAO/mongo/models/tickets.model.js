const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  code: { type: String, required: true, unique: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
  products: { productId: { type: Object }, _id: false, quantity: { type: Number }, totalPrice: { type: Number }  }
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = TicketModel;
