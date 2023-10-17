// user.service.js
const { error } = require('winston');
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
      console.log("entro en togglePremiumUser en el servicio");
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return { user: null, userDocumentCount: null }; // Devuelve tanto el usuario como el recuento de documentos como nulos.
      }
  
      const userDocuments = user.documents;
      console.log("userDocuments", userDocuments);
      const userDocumentCount = userDocuments.length;
      console.log("userDocumentCount", userDocumentCount);
  
      if (userDocumentCount < 3) {
        console.log("La cantidad de documentos es menor que 3");
        return { user: null, userDocumentCount }; // Devuelve el usuario como nulo y el recuento de documentos actual.
      } else {
        console.log("La cantidad de documentos es mayor o igual a 3");
        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();
      }
  
      return { user, userDocumentCount }; // Devuelve el usuario actualizado y el recuento de documentos.
    } catch (error) {
      throw error;
    }
  }
  

}

module.exports = UserService;
