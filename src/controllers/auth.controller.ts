import authService from '../services/auth.service.js';
import { env } from '../config/env.js';
import { CookieOptions } from 'express';
import { APIResponse } from '../types/api.type.js';
import {
   loginBodySchema,
   registerBodySchema,
   resetPasswordBodySchema,
} from '../schemas/auth.schema.js';
import { getRefreshTokenOrThrow } from '../utils/cookieParser.utils.js';
import createValidatedHandler from '../utils/createValidatedHandler.js';
import AppError from '../core/AppError.js';

type AuthUserResponse = {
   username: string;
};

const expiresInDays = env.EXPIRES_IN_REFRESH_TOKEN;
const maxAge = expiresInDays * 1000 * 60 * 60 * 24;

const cookieOptions: CookieOptions = {
   maxAge,
   httpOnly: true,
   secure: env.NODE_ENV === 'production',
   sameSite: 'strict',
};

const clearCookieOptions: CookieOptions = {
   httpOnly: true,
   secure: env.NODE_ENV === 'production',
   sameSite: 'strict',
};

const register = createValidatedHandler(
   { body: registerBodySchema },
   async ({ req, res, body }) => {
      const user = await authService.register(body, req.log);

      res.cookie('refreshToken', user.refreshToken, cookieOptions);
      res.status(201).json({
         status: 'success',
         data: {
            username: user.username,
         },
         accessToken: user.accessToken,
      } satisfies APIResponse<AuthUserResponse>);
   },
);

const login = createValidatedHandler({ body: loginBodySchema }, async ({ body, req, res }) => {
   const user = await authService.login(body, req.log);

   res.cookie('refreshToken', user.refreshToken, cookieOptions);
   res.status(200).json({
      status: 'success',
      data: {
         username: user.username,
      },
      accessToken: user.accessToken,
   } satisfies APIResponse<AuthUserResponse>);
});

const logout = createValidatedHandler({}, async ({ req, res }) => {
   const refreshToken = getRefreshTokenOrThrow(req);

   await authService.logout(refreshToken, req.log);

   res.clearCookie('refreshToken', clearCookieOptions);
   res.sendStatus(204);
});

const resetPassword = createValidatedHandler(
   { body: resetPasswordBodySchema },
   async ({ body, req, res }) => {
      if (!req.user) {
         throw new AppError('User not authenticated', 401);
      }

      const user = req.user;

      const username = await authService.resetPassword(body, user, req.log);

      res.status(200).json({
         status: 'success',
         message: 'Password has been changed successfully',
         data: {
            username,
         },
      } satisfies APIResponse<AuthUserResponse>);
   },
);

const token = createValidatedHandler({}, async ({ req, res }) => {
   const refreshToken = getRefreshTokenOrThrow(req);

   const user = await authService.token(refreshToken, req.log);

   res.cookie('refreshToken', user.refreshToken, cookieOptions);

   res.status(201).json({
      status: 'success',
      data: {
         username: user.username,
      },
      accessToken: user.accessToken,
   } satisfies APIResponse<AuthUserResponse>);
});

export { register, login, logout, token, resetPassword };
