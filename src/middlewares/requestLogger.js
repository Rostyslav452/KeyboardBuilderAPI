import logger from "../utils/logger.js";
import pinoHttp from "pino-http";
import crypto from "crypto";

const requestLogger = pinoHttp({
    logger: logger,
    serializers: {
        req(req) {
            const santitizedBody = { ...req.raw.body };
            const sensitiveFields = [
                "password",
                "newPassword",
                "oldPassword",
                "token",
            ];

            sensitiveFields.forEach((field) => {
                if (santitizedBody[field]) santitizedBody[field] = "*****";
            });

            return {
                method: req.method,
                url: req.url,
                ip: req.ip,
                body: santitizedBody,
            };
        },
    },
    genReqId: (req, res) => {
        return req.id || crypto.randomUUID();
    },
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500 || err) return "silent";
        return "info";
    },
});

export { requestLogger };
