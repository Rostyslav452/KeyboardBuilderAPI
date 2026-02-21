import rateLimiter from "express-rate-limit";
import AppError from "../utils/appError.js";
import { env } from "../config/env.js";

const globalRateLimiter = rateLimiter({
    windowMs: 1000 * 60 * 5,
    limit: 1000,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (req, res, next) => {
        req.log.warn(
            {
                url: req.url,
                method: req.method,
                ip: req.ip,
                user: req.user ? req.user.id : "guest",
            },
            "User have reached limit of requests",
        );
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
    handler: (req, res, next) => {
        req.log.warn(
            {
                url: req.url,
                method: req.method,
                ip: req.ip,
                user: req.user ? req.user.id : "guest",
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
    handler: (req, res, next) => {
        req.log.warn(
            {
                windowMs,
                limit,
                user: req.user ? req.user.id : "guest",
            },
            "Too many register attempt",
        );
        next(new AppError("Too many register attempt, try again later", 429));
    },
});

export { globalRateLimiter, loginRateLimiter, registerRateLimiter };
