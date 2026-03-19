import { Logger } from "pino";
import { JWTPayload } from "./jwt.type";
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
            user?: JWTPayload;
        }
    }
}

export {};
