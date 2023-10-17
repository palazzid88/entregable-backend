// user.controller.js
const UserModel = require('../DAO/mongo/models/users.model');
const UserService = require('../services/user.service');
const userService = new UserService();

class UserController {

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      const simplifiedUsers = users.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }));
      res.render('all-users', { users: simplifiedUsers })
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener usuarios" });
    }
  }

  async deleteOldUsers (req, res) {
    console.log("users.controller deleteOldUsers")
    try {
      // Llama al servicio para eliminar usuarios inactivos y obtener la lista de usuarios eliminados
      const deletedUsers = await userService.deleteInactiveUsers();
      console.log("deletedUsers", deletedUsers)

      // Envía una respuesta con la lista de usuarios eliminados
      return res.status(200).json({ message: 'Usuarios inactivos eliminados con éxito', deletedUsers });
    } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
      return res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
    }
  }

  async togglePremiumUser(req, res) {
    console.log("entro a toggle en users.controller");
    try {
      const { uid } = req.params;
      const result = await userService.togglePremiumUser(uid);
      const { user, userDocumentCount } = result;
      const userRegresive = 3 - userDocumentCount
      

      console.log("userDocumentCount", userDocumentCount)
  
      if (!user) {
        console.log("!user")
        return res.status(404).render('error-document', { uid, userDocumentCount, userRegresive });
      }
  
      if (userDocumentCount) {
        console.log("exito")
        return res.render('changeRole', { msg: 'Role actualizado con éxito', userDocumentCount });
      } else {
        console.log("falta")
        return res.render('changeRole', { msg: 'La cantidad de documentos es menor que 3', userDocumentCount });
      }
    } catch (error) {
      console.log("catch")
      return res.status(500).json({ error: 'Error al cambiar el rol del usuario' });
    }
  }
  

  async uploadForm(req, res) {
    try {
      const { uid } = req.params;
      const userId = uid;
      res.render('upload-documents', { userId })
    } catch (error) {
      console.error(error);
    }
  }

  // Configuración de gardado dearchivos en multer
  async uploadDocument(req, res) {
    try {
      const { uid } = req.params;
      const { originalname, filename } = req.file; // Obtiene el nombre original y el nombre del archivo guardado por Multer
      const { documentType } = req.body;

      // Crea un objeto que representa el documento cargado
      const newDocument = {
        name: originalname,
        reference: filename,
        documentType,
      };

      // Encuentra al usuario por su ID
      const user = await UserModel.findById(uid);
      console.log("user", user)

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Agrega el nuevo documento al array de documentos del usuario
      user.documents.push(newDocument);

      // Guarda la actualización en la base de datos
      await user.save();

      const result = await userService.togglePremiumUser(uid);
      const { userDocumentCount } = result;
      const userRegresive = 3 - userDocumentCount;
      let changeRole = false
      let changeRoleFalse = true

      if (userDocumentCount >= 3) {
        changeRole = true
        changeRoleFalse = false
      }



      res.render('uploaded-succesfully', {uid, userDocumentCount, userRegresive, changeRole, changeRoleFalse} )
    } catch (error) {
      console.error('Error al cargar el documento:', error);
      return res.status(500).json({ error: 'Error al cargar el documento' });
    }
  }

}

module.exports = UserController;
