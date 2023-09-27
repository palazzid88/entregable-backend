// user.controller.js
const UserModel = require('../DAO/mongo/models/users.model');
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

  async uploadForm(req, res) {
    console.log("entró a upload form")
    try {
      const { uid } = req.params;
      const userId = uid;
      console.log("userId en uploadForm", userId)
      res.render('upload-documents', { userId })
    } catch (error) {
      console.log("catch uploadForm")
      console.error(error);
    }
  }

  // Configuración de gardado dearchivos en multer
  async uploadDocument(req, res) {
    try {
      console.log("ingresó a uploadDocument en usersController")
      const { uid } = req.params;
      console.log("uid", uid)
      const { originalname, filename } = req.file; // Obtiene el nombre original y el nombre del archivo guardado por Multer
      const { documentType } = req.body; // Esto depende de cómo se envía el tipo de documento desde el front-end

      // Crea un objeto que representa el documento cargado
      const newDocument = {
        name: originalname,
        reference: filename,
        documentType, // Asegúrate de enviar el tipo de documento desde el front-end
      };

      console.log("newDocument", newDocument)

      // Encuentra al usuario por su ID
      const user = await UserModel.findById(uid);
      console.log("user", user)

      if (!user) {
        console.log("!user")
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Agrega el nuevo documento al array de documentos del usuario
      user.documents.push(newDocument);

      // Guarda la actualización en la base de datos
      await user.save();

      // return res.status(200).json({ message: 'Documento cargado con éxito' });
      res.render('uploaded-succesfully')
    } catch (error) {
      console.error('Error al cargar el documento:', error);
      return res.status(500).json({ error: 'Error al cargar el documento' });
    }
  }

}

module.exports = UserController;
