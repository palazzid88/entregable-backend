const mokingService = require("../services/moking.service");

class MockingController {
  async generateMockProducts(req, res) {
    try {
      const mockProducts = mokingService.generateMockProducts(); // Llama a la función en el servicio para generar los productos
      return res.status(200).json(mockProducts);
    } catch (error) {
      logger.error('Ocurrió un error en la función generateMockProducts:', e)
      return res.status(500).json({ error: 'An error occurred while generating mock products.' });
    }
  }
}

module.exports = new MockingController();
