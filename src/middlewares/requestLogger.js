import logger from "./utils/logger.js";
import pinoHttp from "pino-http";

// const requestLogger = (req, res, next) => {
//     req.log = logger.child({ requestId: crypto.randomUUID() });
//     req.log.info({ method: req.method, url: req.url }, "Incoming request");

//     const start = Date.now();

//     res.on("finish", () => {
//         const duration = Date.now() - start;
//         req.log.info(
//             {
//                 statusCode: res.statusCode,
//                 duration: `${duration}ms`,
//             },
//             "Request completed",
//         );
//     });

//     next();
// };

const requestLogger = pinoHttp({
    logger: logger,
    genReqId: (req, res) => {
        return req.id || crypto.randomUUID();
    },
});

export { requestLogger };
