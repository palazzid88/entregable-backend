// import passport from "passport";
const mongoose = require("mongoose");
require('dotenv').config();


async function connectMongo() {
const modeDB = process.env.MODE_DB 
console.log("MODO:", modeDB)


  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/?retryWrites=true&w=majority`
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
