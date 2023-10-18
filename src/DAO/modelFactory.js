const MongoStore = require("connect-mongo");
const { connectMongo } = require('../utils');

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
      const MONGO_PASS = process.env.MONGO_PASS;
      const MONGO_DIR = proces.env.MONGO_DIR;
      connectMongo(MONGO_PASS);
      factoryStore = {
        store: MongoStore.create({
          mongoUrl: `mongodb+srv://spy0x:${MONGO_PASS}@${MONGO_DIR}/ecommerce?retryWrites=true&w=majority`,
          ttl: 1000,
        }),
      };
  }

  cartsDao = MongoCarts.default;
  productsDao = MongoProducts.default;
  usersDao = MongoUsers.default;


  module.exports = {
    cartsDao,
    productsDao,
    usersDao
  };
}

initFactory();
