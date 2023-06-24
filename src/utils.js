// import passport from "passport";
const mongoose = require("mongoose");

async function connectMongo() {
  try {
    await mongoose.connect(
      "mongodb+srv://palazzid88:qv500UC1DtMcjUj8@coder-house.ekzznmk.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Conexión exitosa a MongoDB!");
  } catch (error) {
    console.log(error);
    throw "No se puede conectar a la base de datos";
  }
}

//------------bcrypt---------------
const bcrypt = require('bcrypt');

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);


module.exports = { connectMongo, createHash, isValidPassword };
