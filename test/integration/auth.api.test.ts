import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import db from '../../src/models/index.js';
import app from '../../src/app.js';
import request from 'supertest';

describe('Auth API Integration Tests', () => {
   beforeAll(async () => {
      await db.sequelize.authenticate();

      await db.sequelize.sync({ force: true });
   });

   beforeEach(async () => {
      await db.Token.destroy({ where: {} });
      await db.User.destroy({ where: {} });
   });

   afterAll(async () => {
      await db.sequelize.close();
   });

   describe('POST api/v1/auth/register', () => {
      it('should successfully register user and return tokens', async () => {
         const registerData = {
            username: 'John',
            password: 'Test1234',
            confirmPassword: 'Test1234',
         };

         const res = await request(app).post('/api/v1/auth/register').send(registerData);

         expect(res.status).toBe(201);

         expect(res.body).toHaveProperty('accessToken');
         expect(res.body).toHaveProperty('data');
         expect(res.body.status).toBe('success');
         expect(res.body.data.username).toBe(registerData.username);

         const userInDb = await db.User.findOne({
            where: {
               username: registerData.username,
            },
         });
         expect(userInDb).not.toBeNull();
         expect(userInDb?.username).toBe(registerData.username);
      });

      it('should return 409 if user already exists', async () => {
         const registerData = {
            username: 'John',
            password: 'Test1234',
            confirmPassword: 'Test1234',
         };

         await request(app).post('/api/v1/auth/register').send(registerData);
         const res = await request(app).post('/api/v1/auth/register').send(registerData);

         expect(res.status).toBe(409);
         expect(res.body.status).toBe('fail');
      });

      it('should return 400 if password mismatching ', async () => {
         const registerData = {
            username: 'John',
            password: 'Test1234',
            confirmPassword: '1234Test',
         };

         const res = await request(app).post('/api/v1/auth/register').send(registerData);

         expect(res.status).toBe(400);
         expect(res.body.status).toBe('fail');
      });
   });

   describe('POST api/v1/auth/login', () => {
      it('should login user when credentials is valid', async () => {
         const registerData = {
            username: 'John',
            password: 'Test1234',
            confirmPassword: 'Test1234',
         };

         const loginData = {
            username: registerData.username,
            password: registerData.password,
         };

         await request(app).post('/api/v1/auth/register').send(registerData);
         const res = await request(app).post('/api/v1/auth/login').send(loginData);

         expect(res.status).toBe(200);
         expect(res.body).toHaveProperty('accessToken');
         expect(res.body).toHaveProperty('data');
         expect(res.body.status).toBe('success');
         expect(res.body.data.username).toBe(loginData.username);
      });

      it('should return 401 when credentials are invalid', async () => {
         const registerData = {
            username: 'John',
            password: 'Test1234',
            confirmPassword: 'Test1234',
         };

         const loginData = {
            username: 'fake_user',
            password: registerData.password,
         };

         await request(app).post('/api/v1/auth/register').send(registerData);
         const res = await request(app).post('/api/v1/auth/login').send(loginData);

         expect(res.status).toBe(401);
         expect(res.body.status).toBe('fail');
      });
   });

   describe('POST api/v1/auth/logout', () => {
      it('should logout user and clear session', async () => {
         const registerData = {
            username: 'John',
            password: 'Test1234',
            confirmPassword: 'Test1234',
         };

         const authRes = await request(app).post('/api/v1/auth/register').send(registerData);

         const cookies = authRes.headers['set-cookie'];

         const res = await request(app).post('/api/v1/auth/logout').set('Cookie', cookies);

         expect(res.status).toBe(204);
         expect(res.body).toEqual({});

         const tokenInDb = await db.Token.findOne({
            where: { username: registerData.username },
         });
         expect(tokenInDb).toBeNull();
      });

      it('should return 401 if refresh token expired or missing in session database', async () => {
         const res = await request(app).post('/api/v1/auth/logout');

         expect(res.status).toBe(401);
         expect(res.body.message).toBe('No refresh token provided or invalid format');
         expect(res.body.status).toBe('fail');
      });
   });

   describe('POST api/v1/auth/token', () => {
      it('should return renewed refresh and generate new access tokens', async () => {
         const registerData = {
            username: 'John',
            password: 'Test1234',
            confirmPassword: 'Test1234',
         };

         const authRes = await request(app).post('/api/v1/auth/register').send(registerData);

         const authCookies = authRes.headers['set-cookie'];

         const res = await request(app).post('/api/v1/auth/token').set('Cookie', authCookies);

         const cookies = res.headers['set-cookie'] as unknown as string[];

         const newCookieString = cookies.find((c: string) => c.startsWith('refreshToken='));

         if (newCookieString === undefined) {
            throw new Error('Refresh token cookie was not returned');
         }

         const newRefreshToken = newCookieString.split(';')[0].split('=')[1];

         expect(res.status).toBe(201);

         expect(res.body).toHaveProperty('accessToken');
         expect(res.body).toHaveProperty('data');
         expect(res.body.status).toBe('success');
         expect(res.body.data.username).toBe(registerData.username);
         expect(res.body.accessToken).not.toBe(authRes.body.accessToken);
         expect(cookies).not.toEqual(authCookies);

         const tokenInDb = await db.Token.findOne({
            where: { username: registerData.username },
         });

         expect(tokenInDb).not.toBeNull();
         const isMatch = await tokenInDb?.compareToken(newRefreshToken);
         expect(isMatch).toBe(true);
         expect(await db.Token.count({ where: { username: registerData.username } })).toBe(1);
      });
   });
});
