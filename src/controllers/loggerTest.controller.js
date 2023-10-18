const loggerTestService = require("../services/loggerTest.service");


class loggerTestController {
  async executeTest(req, res) {
      try {
          const loggerTest =  loggerTestService.executeTest(); // Pasa la respuesta 'res' al servicio
          res.send('Logs probados');
      } catch (error) {
        logger.error('Ocurrió un error en la función executeTest:', e)
        res.status(500).send("Error occurred during logger test");
      }
  }
}

module.exports = new loggerTestController;
