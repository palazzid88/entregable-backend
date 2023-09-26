const { json } = require("express");
const { userDTO } = require("../DAO/dto/auth.dto");

class SessionsController {
    currentSession(req, res) {
        console.log("ingresó en currentSession")
        const user = new userDTO(req.session.user)
        return res.send(JSON.stringify(user));
    }
}

module.exports = new SessionsController()