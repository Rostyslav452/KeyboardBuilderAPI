import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { type User } from '../models/user.model.js';
import db from '../models/index.js';
import authService from './auth.service.js';
import { LoginDto, RegisterDto, ResetPasswordDto } from '../schemas/auth.schema.js';
import jwt from 'jsonwebtoken';
import { Logger } from 'pino';
import { JWTPayload } from '../types/jwt.type.js';
import { Token } from '../models/token.model.js';
import { env } from '../config/env.js';

jest.mock('../models/index.js', () => ({
   User: {
      create: jest.fn(),
      findByPk: jest.fn(),
   },
   Token: {
      create: jest.fn(),
      destroy: jest.fn(),
      findAll: jest.fn(),
   },
}));

jest.mock('jsonwebtoken', () => ({
   sign: jest.fn(),
   verify: jest.fn(),
}));

jest.mock('../config/env.js', () => ({
   env: {
      EXPIRES_IN_REFRESH_TOKEN: 7,
      REFRESH_TOKEN_SECRET: 'test-refresh-secret',
      ACCESS_TOKEN_SECRET: 'test-access-secret',
   },
}));

const mockLogger = {
   info: jest.fn(),
   warn: jest.fn(),
   error: jest.fn(),
} as unknown as Logger;

describe('Auth service tests', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it('register should register user and return user data', async () => {
      const registerDto: RegisterDto = {
         username: 'JohnDoe',
         password: 'password123',
         confirmPassword: 'password123',
      };

      const fakeUserInstance = { username: 'JohnDoe' } as unknown as User;
      const fakeAccessToken = 'fake-access-token';
      const fakeRefreshToken = 'fake-refresh-token';

      jest.mocked(db.User.findByPk).mockResolvedValue(null);

      jest.mocked(db.User.create).mockResolvedValue(fakeUserInstance);

      jest.mocked(db.Token.create).mockResolvedValue({} as Token);

      (jwt.sign as jest.Mock)
         .mockReturnValueOnce(fakeRefreshToken)
         .mockReturnValueOnce(fakeAccessToken);

      const result = await authService.register(registerDto, mockLogger);

      expect(result).toEqual({
         username: fakeUserInstance.username,
         accessToken: fakeAccessToken,
         refreshToken: fakeRefreshToken,
      });

      expect(db.User.findByPk).toHaveBeenCalledWith(fakeUserInstance.username);
      expect(db.User.create).toHaveBeenCalledWith({
         username: registerDto.username,
         password: registerDto.password,
      });

      expect(db.User.findByPk).toHaveBeenCalledTimes(1);
      expect(db.User.create).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(db.Token.create).toHaveBeenCalledTimes(1);
   });

   it('login should login and return user data', async () => {
      const loginDto: LoginDto = {
         username: 'JohnDoe',
         password: 'password123',
      };

      const fakeUserInstance = {
         username: 'JohnDoe',
         comparePassword: jest.fn<() => Promise<true>>().mockResolvedValue(true),
      } as unknown as User;
      const fakeAccessToken = 'fake-access-token';
      const fakeRefreshToken = 'fake-refresh-token';

      jest.mocked(db.User.findByPk).mockResolvedValue(fakeUserInstance);

      jest.mocked(db.Token.create).mockResolvedValue({} as Token);

      (jwt.sign as jest.Mock)
         .mockReturnValueOnce(fakeRefreshToken)
         .mockReturnValueOnce(fakeAccessToken);

      const result = await authService.login(loginDto, mockLogger);

      expect(result).toEqual({
         username: fakeUserInstance.username,
         accessToken: fakeAccessToken,
         refreshToken: fakeRefreshToken,
      });

      expect(db.User.findByPk).toHaveBeenCalledWith(loginDto.username);
      expect(fakeUserInstance.comparePassword).toHaveBeenCalledWith(loginDto.password);

      expect(fakeUserInstance.comparePassword).toHaveBeenCalledTimes(1);
      expect(db.User.findByPk).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(db.Token.create).toHaveBeenCalledTimes(1);
   });

   it('resetPassword should reset password, delete all session tokens and return username', async () => {
      const fakePayload = { username: 'JohnDoe' } as unknown as JWTPayload;
      const resetPasswordDto: ResetPasswordDto = {
         password: 'password123',
         newPassword: '123password',
      };
      const fakeUserInstance = {
         username: 'JohnDoe',
         comparePassword: jest.fn<() => Promise<true>>().mockResolvedValue(true),
         update: jest.fn<() => Promise<null>>().mockResolvedValue(null),
      } as unknown as User;

      jest.mocked(db.User.findByPk).mockResolvedValue(fakeUserInstance);

      jest.mocked(db.Token.destroy).mockResolvedValue(1);

      const result = await authService.resetPassword(resetPasswordDto, fakePayload, mockLogger);

      expect(result).toEqual(fakePayload.username);

      expect(db.User.findByPk).toHaveBeenCalledWith(fakePayload.username);
      expect(fakeUserInstance.comparePassword).toHaveBeenCalledWith(resetPasswordDto.password);
      expect(fakeUserInstance.update).toHaveBeenCalledWith({
         password: resetPasswordDto.newPassword,
      });

      expect(fakeUserInstance.update).toHaveBeenCalledTimes(1);
      expect(fakeUserInstance.comparePassword).toHaveBeenCalledTimes(1);
      expect(db.User.findByPk).toHaveBeenCalledTimes(1);
      expect(db.Token.destroy).toHaveBeenCalledTimes(1);
   });

   it('logout should delete session and return username', async () => {
      const fakeRefreshToken = 'fake-refresh-token';
      const fakeData = { username: 'JohnDoe' } as unknown as JWTPayload;
      const fakeTokensByUser = [
         {
            compareToken: jest.fn<() => Promise<true>>().mockResolvedValue(true),
            destroy: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
         },
      ] as unknown as Token[];

      (jwt.verify as jest.Mock).mockReturnValue(fakeData);

      jest.mocked(db.Token.findAll).mockResolvedValue(fakeTokensByUser);

      const result = await authService.logout(fakeRefreshToken, mockLogger);

      expect(result).toBeUndefined();

      expect(db.Token.findAll).toHaveBeenCalledWith({
         where: { username: fakeData.username },
      });
      expect(fakeTokensByUser[0].compareToken).toHaveBeenCalledWith(fakeRefreshToken);
      expect(fakeTokensByUser[0].destroy).toHaveBeenCalledWith();

      expect(fakeTokensByUser[0].compareToken).toHaveBeenCalledTimes(1);
      expect(fakeTokensByUser[0].destroy).toHaveBeenCalledTimes(1);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(db.Token.findAll).toHaveBeenCalledTimes(1);
   });

   it('token should generate new tokens, delete old token and return auth data', async () => {
      const oldRefreshToken = 'old-refresh-token';
      const fakePayload = { username: 'JohnDoe' } as unknown as JWTPayload;

      const newAccessToken = 'new-access-token';
      const newRefreshToken = 'new-refresh-token';

      const fakeTokensByUser = [
         {
            compareToken: jest.fn<() => Promise<true>>().mockResolvedValue(true),
            destroy: jest.fn<() => Promise<undefined>>().mockResolvedValue(undefined),
         },
      ] as unknown as Token[];

      (jwt.verify as jest.Mock).mockReturnValue(fakePayload);

      jest.mocked(db.Token.findAll).mockResolvedValue(fakeTokensByUser);

      (jwt.sign as jest.Mock)
         .mockReturnValueOnce(newRefreshToken)
         .mockReturnValueOnce(newAccessToken);

      jest.mocked(db.Token.create).mockResolvedValue({} as Token);

      const result = await authService.token(oldRefreshToken, mockLogger);

      expect(result).toEqual({
         username: fakePayload.username,
         accessToken: newAccessToken,
         refreshToken: newRefreshToken,
      });

      expect(jwt.verify).toHaveBeenCalledWith(oldRefreshToken, env.REFRESH_TOKEN_SECRET);
      expect(db.Token.findAll).toHaveBeenCalledWith({
         where: { username: fakePayload.username },
      });

      expect(fakeTokensByUser[0].compareToken).toHaveBeenCalledWith(oldRefreshToken);
      expect(fakeTokensByUser[0].destroy).toHaveBeenCalledTimes(1);

      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(db.Token.create).toHaveBeenCalledTimes(1);
   });
});
