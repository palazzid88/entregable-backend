const HomeService = require('../services/home.service.js');

class HomeController {
    async getProducts (req, res) {
        try {
            const products = await HomeService.getProducts();
            console.log(products)
            return res.render("products", {products})
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });            
        }
    }
}

module.exports = new HomeController