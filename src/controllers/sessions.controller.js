const { json } = require("express");
const { userDTO } = require("../DAO/dto/auth.dto");

class SessionsController {
    currentSession(req, res) {
        try {
            const user = new userDTO(req.session.user);
            return res.send(JSON.stringify(user));
        } catch (e) {
            logger.error('Ocurrió un error en la función updateProduct:', e)
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }
}

module.exports = new SessionsController()