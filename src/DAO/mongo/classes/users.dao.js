const UserModel = require("../models/users.model"); // Asegúrate de proporcionar la ruta correcta al modelo UserModel

const usersDao = {
  create: async (userData) => {
    return await UserModel.create(userData);
  },

  findOne: async (query, projection) => {
    return await UserModel.findOne(query, projection);
  },

  find: async (query, projection) => {
    return await UserModel.find(query, projection);
  },

  findByIdAndUpdate: async (id, updateData, options) => {
    return await UserModel.findByIdAndUpdate(id, updateData, options);
  },

  findByIdAndDelete: async (id) => {
    return await UserModel.findByIdAndDelete(id);
  },
};

module.exports = usersDao;
