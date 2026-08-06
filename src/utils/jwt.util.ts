import AppError from '../core/AppError.js';
import { JWTPayload } from '../types/jwt.type.js';

const extractBearerToken = (authorizationHeader?: string) => {
    if (!authorizationHeader) {
        throw new AppError('Error authentication, empty token', 401);
    }

    const [scheme, token] = authorizationHeader.trim().split(' ');

    if (!scheme || !token || scheme !== 'Bearer') {
        throw new AppError('Error authentication, token must be in format: Bearer <token>', 401);
    }
    return token;
};

const validateJWTPayload = (decoded?: unknown) => {
    if (
        !decoded ||
        typeof decoded !== 'object' ||
        !('username' in decoded) ||
        typeof decoded.username !== 'string'
    ) {
        throw new AppError('Invalid token payload', 401);
    }
    return decoded as JWTPayload;
};

export { extractBearerToken, validateJWTPayload };
