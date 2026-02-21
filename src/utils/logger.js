import pino from "pino";
import dotenv from "dotenv";
dotenv.config();


const transport = pino.transport({
    targets: [
        {
            target: "pino/file",
            level: "error",
            options: {
                mkdir: true,
                destination: "../log/error.log",
            },
        },
        {
            target: "pino/file",
            level: "info",
            options: {
                mkdir: true,
                destination: "../log/info.log",
            },
        },
        {
            target: "pino-pretty",
            level: "debug",
            options: {
                colorize: true,
                singleLine: true,
                destination: 1,
            },
        },
    ],
});

const logger = pino({ level: process.env.LOG_LEVEL }, transport);

export default logger;
