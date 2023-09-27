const multer = require('multer');

// Configuración el almacenamiento de archivos:
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Carpeta de almacenamiento de los archivos:
    if (file.fieldname === 'profileImage') {
      cb(null, './src/uploads/profiles'); // Para imágenes de perfil
    } else if (file.fieldname === 'productImage') {
      cb(null, './src/uploads/products'); // Para imágenes de productos
    } else if (file.fieldname === 'document') {
      cb(null, './src/uploads/documents'); // Para documentos
    } else {
      cb(new Error('Invalid fieldname'), false);
    }
  },
  filename: function (req, file, cb) {
    // Configurar los archivos con nombre único:
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  },
});

// Crear la instancia de Multer
const multerConfig = multer({ storage });

module.exports = multerConfig;
