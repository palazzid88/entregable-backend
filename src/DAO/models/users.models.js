const mongoose = require("mongoose");
const paginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const schema = new Schema({
    firstName: {
        type: String,
        required: true,
        max: 100,
    },
    lastName: {
        type: String,
        required: true,
        max: 100,
    },
    email: {
        type: String,
        required: true,
        max: 100,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        max: 100,
        min: 6
    },

    isAdmin: {
        type: Boolean,
        required: true,
    },
});
schema.plugin(paginate);
const UserModel = mongoose.model("users", schema);

module.exports = UserModel;