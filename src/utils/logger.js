import pino from "pino";

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
            level: "debug",
            options: {
                mkdir:true,
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

const logger = pino(transport);

export default logger;
