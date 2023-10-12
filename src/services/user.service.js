// user.service.js
const UserModel = require('../DAO/mongo/models/users.model');
const mailer = require('../services/mailing.service'); // Importa tu servicio de envío de correo


class UserService {
  async getAllUsers() {
    try {
      const users = await UserModel.find({});
      return users;
    } catch (error) {
      console.error("Error en getAllUsers del servicio:", error);
      throw error; // Puedes propagar el error para manejarlo en la capa superior.
    }
  }

  async deleteInactiveUsers() {
    console.log("ingreso a deleteInactiveUsers en el service")
    try {
      const currentDate = new Date();

      // Calcula la fecha hace 2 días
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(currentDate.getDate() - 2);

      // Encuentra todos los usuarios cuya última conexión es anterior a twoDaysAgo
      const inactiveUsers = await UserModel.find({ last_connection: { $lt: twoDaysAgo } });

      // Elimina a los usuarios inactivos
      const deletedUsers = await UserModel.deleteMany({ _id: { $in: inactiveUsers.map(user => user._id) } });

      // Envía correos electrónicos a los usuarios inactivos notificándoles la eliminación de sus cuentas
      inactiveUsers.forEach(async (user) => {
        const userEmail = user.email; // Obten la dirección de correo del usuario
      
        // Envía el correo de eliminación de cuenta al usuario
        try {
          await mailer.sendAccountDeletionEmail(userEmail);
          console.log(`Correo de eliminación de cuenta enviado a ${userEmail}`);
        } catch (error) {
          console.error(`Error al enviar el correo a ${userEmail}:`, error);
        }
      });

      console.log(`${deletedUsers.deletedCount} usuarios inactivos eliminados y notificados.`);
      return deletedUsers;
    } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
      throw error;
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
