const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
products: [{
  productId: { type: Schema.Types.ObjectId, ref: "Products", required: true },
  quantity: { type: Number, required: true }
}]
});

const CartModel = mongoose.model("carts", cartSchema)

module.exports = CartModel;
