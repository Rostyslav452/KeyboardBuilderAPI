import rateLimiter from 'express-rate-limit';
import AppError from '../core/AppError.js';
import { env } from '../config/env.js';
import logger from '../config/logger.js';
import { Request, Response, NextFunction } from 'express';

const rlLogger = logger.child({ context: 'RateLimiter' });
const globalRateLimitWindowMs = 1000 * 60 * 5;
const globalRateLimitLimit = 1000;
const loginRateLimitWindowMs = 1000 * 60 * 5;
const loginRateLimitLimit = 5;
const registerRateLimitWindowMs = 1000 * 60 * 30;
const registerRateLimitLimit = 3;

const globalRateLimiter = rateLimiter({
    windowMs: globalRateLimitWindowMs,
    limit: globalRateLimitLimit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req: Request, res: Response, next: NextFunction) => {
        rlLogger.warn('User have reached limit of requests');
        next(new AppError('You have reached limit of requests', 429));
    },
    skip: () => {
        return env.NODE_ENV === 'development';
    },
});

const loginRateLimiter = rateLimiter({
    windowMs: loginRateLimitWindowMs,
    limit: loginRateLimitLimit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (req: Request, res: Response, next: NextFunction) => {
        req.log.warn(
            {
                user: req.user ? req.user.username : 'guest',
            },
            'Too many login attempt',
        );
        next(new AppError('Too many login attempt, try again later', 429));
    },
});

const registerRateLimiter = rateLimiter({
    windowMs: registerRateLimitWindowMs,
    limit: registerRateLimitLimit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (req: Request, res: Response, next: NextFunction) => {
        req.log.warn(
            {
                windowMs: registerRateLimitWindowMs,
                limit: req.rateLimit?.limit ?? registerRateLimitLimit,
                remaining: req.rateLimit?.remaining,
                user: req.user ? req.user.username : 'guest',
            },
            'Too many register attempt',
        );
        next(new AppError('Too many register attempt, try again later', 429));
    },
});

export { globalRateLimiter, loginRateLimiter, registerRateLimiter };
