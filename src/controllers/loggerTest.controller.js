const loggerTestService = require("../services/loggerTest.service");


class loggerTestController {
  async executeTest(req, res) {
      try {
          const loggerTest =  loggerTestService.executeTest(); // Pasa la respuesta 'res' al servicio
          console.log("logger test");
          res.send('Logs probados');
      } catch (error) {
          console.error("An error occurred during logger test:", error);
          res.status(500).send("Error occurred during logger test");
      }
  }
}

module.exports = new loggerTestController;
