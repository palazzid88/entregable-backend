const HomeService = require('../services/home.service.js');

class HomeController {
    async getProducts (req, res) {
        try {
            const products = await HomeService.getProducts();
            return res.render("products", {products})
        }
        catch (e) {
            logger.error('Ocurrió un error en la función getProducts:', e)
            return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });            
        }
    }
}

module.exports = new HomeController