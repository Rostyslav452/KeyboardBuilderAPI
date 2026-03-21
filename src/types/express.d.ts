import { Logger } from "pino";
import { JWTPayload } from "./jwt.type.js";
declare global {
    namespace Express {
        interface Request {
            log: Logger;
            rateLimit?: any;
            user?: JWTPayload;
        }
        interface Locals {
            body?: any;
            params?: any;
            query?: any;
        }
    }
}

export {};
