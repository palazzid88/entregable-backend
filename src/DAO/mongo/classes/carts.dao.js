const CartModel = require("../models/carts.model");

const cartsDao = {
  create: async (cartData) => {
    return await CartModel.create(cartData);
  },

  findById: async (cartId) => {
    return await CartModel.findById(cartId);
  },

  update: async (cartId, updateData) => {
    return await CartModel.findByIdAndUpdate(cartId, updateData, { new: true });
  },

  delete: async (cartId) => {
    return await CartModel.findByIdAndDelete(cartId);
  },
};

module.exports = cartsDao;
