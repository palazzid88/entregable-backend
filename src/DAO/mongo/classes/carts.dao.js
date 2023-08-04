const CartModel = require("../models/carts.model");

class CartDao {
  async create(cartData) {
    try {
      return await CartModel.create(cartData);
    } catch (e) {
      throw e;
    }
  }

  async findById(cartId) {
    try {
      return await CartModel.findById(cartId);
    } catch (e) {
      throw e;
    }
  }

  async update(cartId, updateData) {
    try {
      return await CartModel.findByIdAndUpdate(cartId, updateData, { new: true });
    } catch (e) {
      throw e;
    }
  }

  async delete(cartId) {
    try {
      return await CartModel.findByIdAndDelete(cartId);
    } catch (e) {
      throw e;
    }
  }
}

module.exports = CartDao;
