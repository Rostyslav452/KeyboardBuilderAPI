import rateLimiter from "express-rate-limit";
import AppError from "../core/appError.js";
import { env } from "../config/env.js";
import logger from "../utils/logger.js";
import { Request, Response, NextFunction } from "express";

const rlLogger = logger.child({ context: "RateLimiter" });

const globalRateLimiter = rateLimiter({
    windowMs: 1000 * 60 * 5,
    limit: 1000,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (req: Request, res: Response, next: NextFunction) => {
        rlLogger.warn("User have reached limit of requests");
        next(new AppError("You have reached limit of requests", 429));
    },
    skip: () => {
        return env.NODE_ENV === "development";
    },
});

const loginRateLimiter = rateLimiter({
    windowMs: 1000 * 60 * 5,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (req: Request, res: Response, next: NextFunction) => {
        req.log.warn(
            {
                user: req.user ? req.user.username : "guest",
            },
            "Too many login attempt",
        );
        next(new AppError("Too many login attempt, try again later", 429));
    },
});

const registerRateLimiter = rateLimiter({
    windowMs: 1000 * 60 * 30,
    limit: 3,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (req: Request, res: Response, next: NextFunction) => {
        req.log.warn(
            {
                windowMs: req.rateLimit.windowMs,
                limit: req.rateLimit.limit,
                user: req.user ? req.user.username : "guest",
            },
            "Too many register attempt",
        );
        next(new AppError("Too many register attempt, try again later", 429));
    },
});

export { globalRateLimiter, loginRateLimiter, registerRateLimiter };
