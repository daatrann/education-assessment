import winston from "winston";
const { combine, colorize, timestamp, align, printf } = winston.format;

const currentWorkDir = process.cwd();
const logger = winston.createLogger({
    level: "info",
    format: combine(
        colorize({ all: true }),
        timestamp({
            format: "hh:mm:ss A DD-MM-YYYY",
        }),
        align(),
        printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.File({
            filename: `${currentWorkDir}/logs/error.log`,
            level: "error",
        }),
        new winston.transports.File({
            filename: `${currentWorkDir}/logs/combined.log`,
        }),
        new winston.transports.Console(),
    ],
});

export default logger;
