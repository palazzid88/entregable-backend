const mongoose = require("mongoose");
const paginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  code: { type: String, required: true },
  stock: { type: Number, required: true },
  status: { type: String, required: true },
  category: { type: String, required: true },
  owner: { type: String },
});
productSchema.plugin(paginate)
const ProductModel = mongoose.model("Products", productSchema);

module.exports = ProductModel;
