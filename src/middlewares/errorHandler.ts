import { Response, Request, NextFunction } from "express";
import { env } from "../config/env.js";
import logger from "../utils/logger.js";

const sendErrorDev = (err: any, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

const sendErrorProd = (err: any, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.log("[ERROR]:Unknown error");
        res.status(500).json({
            status: "error",
            message: "Unknown error",
        });
    }
};

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else {
        sendErrorProd(err, res);
    }

    const log = req.log || logger;
    log.error({ err: err });
};

export default errorHandler;
