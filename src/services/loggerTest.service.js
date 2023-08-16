const logger = require('../utils/logger');



class LoggerTestService {
    executeTest() {
        logger.debug('Debug message');
        logger.http('HTTP request');
        logger.info('Info message');
        logger.warning('Warning message');
        logger.error('Error message');
        logger.fatal('Fatal error message');
      
        return 'Logs probados';
    }
}

module.exports =new LoggerTestService()