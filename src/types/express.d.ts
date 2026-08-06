import { Logger } from 'pino';
import { JWTPayload } from './jwt.type.js';
import { RateLimitInfo } from 'express-rate-limit';
declare global {
    namespace Express {
        interface Request {
            log: Logger;
            rateLimit?: RateLimitInfo;
            user?: JWTPayload;
        }
        interface Locals {
            body?: unknown;
            params?: unknown;
            query?: unknown;
        }
    }
}

export {};
