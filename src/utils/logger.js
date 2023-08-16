const winston = require('winston');

// Definir formatos de log personalizados
const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
);

// Crear transportes para el modo desarrollo
const developmentTransports = [
  new winston.transports.Console({ level: 'debug', format: consoleFormat }),
];

// Crear transportes para el modo producción
const productionTransports = [
  new winston.transports.Console({ level: 'info', format: consoleFormat }),
  new winston.transports.File({ filename: 'errors.log', level: 'error' }),
];

// Determinar el modo de ejecución (desarrollo o producción)
const isProduction = process.env.NODE_ENV === 'production';

// Seleccionar transportes según el modo
const selectedTransports = isProduction ? productionTransports : developmentTransports;

// Crear el logger
const logger = winston.createLogger({
  levels: {
    debug: 1,
    http: 2,
    info: 3,
    warning: 4,
    error: 5,
    fatal: 6,
  },
  transports: selectedTransports,
  format: customFormat,
});

module.exports = logger;
