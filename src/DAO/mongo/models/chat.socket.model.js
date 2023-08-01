const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
messages: [{
    user: { type: String, required: true },
    message: { type: String, required: true }
}] 
});

const ChatModel = mongoose.model("chat", chatSchema)

module.exports = ChatModel;
