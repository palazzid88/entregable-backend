// user.service.js
const UserModel = require('../DAO/mongo/models/users.model');

class UserService {
  async getAllUsers() {
    try {
      console.log("Ingreso al getAllUsers del servicio");
      const users = await UserModel.find({});
      console.log("Usuarios en el servicio:", users);
      return users;
    } catch (error) {
      console.error("Error en getAllUsers del servicio:", error);
      throw error; // Puedes propagar el error para manejarlo en la capa superior.
    }
  }

  async togglePremiumUser(userId) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        return null;
      }

      user.role = user.role === 'user' ? 'premium' : 'user';

      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

}

module.exports = UserService;
