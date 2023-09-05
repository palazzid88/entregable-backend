// user.controller.js
const UserService = require('../services/user.service');
const userService = new UserService();

class UserController {

  async togglePremiumUser(req, res) {
    console.log("ingreso a togglePremiumUser")
    try {
      const { uid } = req.params;
      const updatedUser = await userService.togglePremiumUser(uid);

      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      return res.status(200).json({ message: 'Role actualizado con éxito' });
    } catch (error) {
      return res.status(500).json({ error: 'Error al cambiar el rol del usuario' });
    }
  }
}

module.exports = UserController;
