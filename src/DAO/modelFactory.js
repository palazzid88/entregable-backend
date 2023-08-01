const MongoStore = require("connect-mongo");
const { connectMongo } = require('../utils');

// Importa las clases de los DAOs
const MongoCarts = require("../DAO/mongo/classes/carts.dao.js");
const MongoProducts = require("../DAO/mongo/classes/products.dao.js");
const MongoUsers = require("../DAO/mongo/classes/users.dao.js");

let factoryStore;
let cartsDao;
let productsDao;
let usersDao;

async function initFactory() {
  switch (process.env.MONGO_STRING) {
    case "MONGO":
      const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
      connectMongo(MONGO_PASSWORD);
      factoryStore = {
        store: MongoStore.create({
          mongoUrl: `mongodb+srv://spy0x:${MONGO_PASSWORD}@cluster0.7hatvzm.mongodb.net/ecommerce?retryWrites=true&w=majority`,
          ttl: 1000,
        }),
      };
  }

  // Asignamos las referencias a las variables locales
  cartsDao = MongoCarts.default;
  productsDao = MongoProducts.default;
  usersDao = MongoUsers.default;

  // Ahora podemos utilizar las clases como sea necesario en el resto de la función
  // ...

  // Exportamos las referencias a los DAOs después de haber sido inicializados
  module.exports = {
    cartsDao,
    productsDao,
    usersDao
  };
}

// Llamamos a la función para inicializar el factory
initFactory();
