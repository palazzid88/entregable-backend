// user.service.js
const UserModel = require('../DAO/mongo/models/users.model');

class UserService {
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
