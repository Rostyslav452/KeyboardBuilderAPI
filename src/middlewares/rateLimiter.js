import rateLimiter from "express-rate-limit";
import AppError from "../utils/appError";
import env from "../../config/env.js";

const globalRateLimiter = rateLimiter({
    windowMs: 1000 * 60 * 5,
    limit: 1000,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: () => {
        next(new AppError("You have reached limit of requests", 429));
    },
    skip: (req, res) => {
        return env.NODE_ENV === "development";
    },
});

const loginRateLimiter = rateLimiter({
    windowMs: 1000 * 60 * 5,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: () => {
        next(new AppError("Too many login attempt, try again later", 429));
    },
});

const registerRateLimiter = new rateLimiter({
    windowMs: 1000 * 60 * 30,
    limit: 3,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: () =>
        new AppError("Too many register attempt, try again later", 429),
});

export { globalRateLimiter, loginRateLimiter, registerRateLimiter };
