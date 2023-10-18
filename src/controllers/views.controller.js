const viewsRouter = require("../routes/views.router");
const ViewsServices = require("../services/views.services");

class ViewsController {
    async getAll (req, res) {
        try {
            const { page, limit, sort, query } = req.query;
            const result = await ViewsServices.getAll(page, limit, sort, query);
            res.render("home", { products: result.products, pagination: result.pagination });
        } 
        catch (e) {
            logger.error('Ocurrió un error en la función getAll:', e)
            return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
    }
}

module.exports = new ViewsController