import { NextFunction, Response, Request } from 'express';
import { env } from '../config/env.js';
import AppError from '../core/AppError.js';
import { validateJWTPayload, extractBearerToken } from '../utils/jwt.util.js';
import jwt from 'jsonwebtoken';

const authentication = (req: Request, res: Response, next: NextFunction) => {
   req.log.info('Receive token to authentication');

   const token = extractBearerToken(req.headers.authorization);

   try {
      const decodedData = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
      const payload = validateJWTPayload(decodedData);

      req.user = { username: payload.username };

      req.log.info({ username: req.user.username }, 'User authenticated successfully');

      next();
   } catch (error) {
      next(new AppError('Invalid or expired token. Please log in again.', 401, error));
   }
};

export default authentication;
