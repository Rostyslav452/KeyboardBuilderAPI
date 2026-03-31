import pino from "pino";
import { env } from "./env.js";

const transport = pino.transport({
    targets: [
        {
            target: "pino/file",
            level: "error",
            options: {
                mkdir: true,
                destination: "./logs/error.log",
            },
        },
        {
            target: "pino/file",
            level: "info",
            options: {
                mkdir: true,
                destination: "./logs/info.log",
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

const logger = pino(
    {
        level: env.LOG_LEVEL,
        redact: {
            paths: [
                "req.body.password",
                "req.body.newPassword",
                "req.body.oldPassword",
                "req.body.token",
                "req.headers.authorization",
            ],
            censor: "*****",
        },
    },
    transport,
);

export default logger;
