const express = require('express');
const chatRouter = express.Router();


chatRouter.get("/", async (req, res) => {
    try {
        return res.render("chat", {})
    } catch (e) {
        return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
        });
    }
})

module.exports = chatRouter
