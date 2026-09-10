import db from '../models/index.js';
import AppError from '../core/AppError.js';
import { env } from '../config/env.js';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/jwt.type.js';
import { LoginDto, RegisterDto, ResetPasswordDto } from '../schemas/auth.schema.js';
import { Logger } from 'pino';
import { validateJWTPayload } from '../utils/jwt.util.js';
import { randomUUID } from 'node:crypto';

export interface AuthResponse {
   username: string;
   accessToken: string;
   refreshToken: string;
}

class AuthService {
   async #generateAndSaveRefreshToken(payload: JWTPayload, log: Logger): Promise<string> {
      log.info({ payload }, 'Generate refresh token attempt started ');
      const expiresInDays = env.EXPIRES_IN_REFRESH_TOKEN;
      const expiresInMs = expiresInDays * 24 * 60 * 60 * 1000;

      const token = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
         expiresIn: `${expiresInDays}d`,
         jwtid: randomUUID(),
      });

      await db.Token.create({
         username: payload.username,
         refreshToken: token,
         expiresAt: new Date(Date.now() + expiresInMs),
      });

      log.info({ payload }, 'Refresh token generated and saved successfully');

      return token;
   }

   #generateAccessToken(payload: JWTPayload, log: Logger): string {
      log.info({ payload }, 'Generate access token attempt started ');

      const token = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
         expiresIn: '2h',
         jwtid: randomUUID(),
      });

      log.info({ payload }, 'Access token generated successfully');

      return token;
   }

   async register(user: RegisterDto, log: Logger): Promise<AuthResponse> {
      const { username, password } = user;

      log.info({ username }, 'Registration attempt started');

      const candidate = await db.User.findByPk(username);

      if (candidate) {
         log.warn({ username }, 'Registration failed: User already exist');
         throw new AppError(`User with this username ${username} has already exist`, 409);
      }

      await db.User.create({ username, password });

      const payload = { username };

      const refreshToken = await this.#generateAndSaveRefreshToken(payload, log);
      const accessToken = this.#generateAccessToken(payload, log);

      log.info({ payload }, 'Registration successful');

      return { ...payload, accessToken, refreshToken };
   }

   async login(userData: LoginDto, log: Logger): Promise<AuthResponse> {
      const { username, password } = userData;

      log.info({ username }, 'Login attempt started');
      const user = await db.User.findByPk(username);

      if (!user) {
         log.warn({ username }, 'Login failed: User not found');
         throw new AppError('Invalid credentials', 401);
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
         log.warn({ username }, 'Login failed: Incorrect password');
         throw new AppError('Invalid credentials', 401);
      }

      const payload = { username };

      const refreshToken = await this.#generateAndSaveRefreshToken(payload, log);
      const accessToken = this.#generateAccessToken(payload, log);

      log.info({ username }, 'Login successful');
      return { ...payload, accessToken, refreshToken };
   }

   async resetPassword(body: ResetPasswordDto, payload: JWTPayload, log: Logger): Promise<string> {
      const { password, newPassword } = body;
      const { username } = payload;

      log.info({ username }, 'Reset password attempt started');

      const user = await db.User.findByPk(username);

      if (!user) {
         log.warn({ username }, 'Reset password failed: User not found');
         throw new AppError('Invalid credentials', 401);
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
         log.warn({ username }, 'Reset password failed: Incorrect old password ');
         throw new AppError('Invalid credentials', 401);
      }

      await user.update({ password: newPassword });

      await db.Token.destroy({
         where: {
            username: username,
         },
      });

      log.info({ username }, 'Reset password successful');

      return username;
   }

   async logout(refreshToken: string, log: Logger): Promise<void> {
      let data;

      try {
         data = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET, {
            ignoreExpiration: true,
         });
      } catch {
         log.warn('Attempted to logout with invalid token');
         throw new AppError('Invalid refresh token', 401);
      }

      const payload = validateJWTPayload(data);
      log.info({ payload }, 'Payload extracted successfully');

      const allTokensByUser = await db.Token.findAll({
         where: { username: payload.username },
      });

      for (const token of allTokensByUser) {
         if (await token.compareToken(refreshToken)) {
            await token.destroy();
            break;
         }
      }

      log.info('Logout successful: token removed from DB');
   }

   async token(oldRefreshToken: string, log: Logger): Promise<AuthResponse> {
      log.info('Refresh token generation attempt');

      let data: unknown;
      try {
         data = jwt.verify(oldRefreshToken, env.REFRESH_TOKEN_SECRET);
      } catch (err) {
         throw new AppError('Invalid or expired session. Please log in.', 401, err);
      }
      const decodedPayload = validateJWTPayload(data);
      log.info(decodedPayload, 'Refresh token verify successfully');

      const cleanPayload = { username: decodedPayload.username };

      const allTokensByUser = await db.Token.findAll({
         where: { username: cleanPayload.username },
      });

      if (allTokensByUser.length === 0) {
         throw new AppError('User with provided username not exist in Database', 401);
      }

      let refreshToken: string = '';
      let isMatch = false;
      for (const token of allTokensByUser) {
         isMatch = await token.compareToken(oldRefreshToken);
         if (isMatch) {
            refreshToken = await this.#generateAndSaveRefreshToken(cleanPayload, log);
            await token.destroy();
            break;
         }
      }

      if (!isMatch) {
         throw new AppError('User with provided token not exist in Database', 401);
      }

      const accessToken = this.#generateAccessToken(cleanPayload, log);
      return { ...cleanPayload, accessToken, refreshToken };
   }
}

export default new AuthService();
