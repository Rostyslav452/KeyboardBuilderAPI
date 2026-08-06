import { env } from '../config/env.js';
import AppError from '../core/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { validateJWTPayload, extractBearerToken } from '../utils/jwt.util.js';
import jwt from 'jsonwebtoken';

const authentication = asyncHandler(async (req, res, next) => {
    req.log.info('Receive token to authentication');

    const token = extractBearerToken(req.headers.authorization);

    try {
        const decodedData = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
        const payload = validateJWTPayload(decodedData);

        req.user = { username: payload.username };

        req.log.info({ username: req.user.username }, 'User authenticated successfully');

        next();
    } catch (error) {
        throw new AppError('Invalid or expired token. Please log in again.', 401, error);
    }
});

export default authentication;
