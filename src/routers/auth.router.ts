import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { loginRateLimiter, registerRateLimiter } from '../middlewares/rateLimiter.js';
import authentication from '../middlewares/authentication.js';

const router = express.Router();

router.route('/login').post(loginRateLimiter, authController.login);

router.route('/register').post(registerRateLimiter, authController.register);

router.route('/resetPassword').post(authentication, authController.resetPassword);

router.route('/token').post(authController.token);

router.route('/logout').post(authController.logout);

export default router;
