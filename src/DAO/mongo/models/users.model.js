const mongoose = require("mongoose");
const paginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    name: String,
    reference: String,
});

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
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
        max: 100,
        min: 6
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'premium'],
        default: 'user',
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    documents: [documentSchema],
    last_connection: {
        type: Date,
        default: null,
    },
});

schema.plugin(paginate);
const UserModel = mongoose.model("users", schema);

module.exports = UserModel;
