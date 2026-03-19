import express from "express";
import validate from "../middlewares/validateMiddleware.js";
import {
    loginSchema,
    registerSchema,
    resetPasswordSchema,
} from "../schemas/authSchema.js";
import * as authController from "../controllers/authController.js";
import {
    loginRateLimiter,
    registerRateLimiter,
} from "../middlewares/rateLimiter.js";
import authentication from "../middlewares/authMiddleware.js";

const router = express.Router();

router
    .route("/login")
    .post(loginRateLimiter, validate(loginSchema), authController.login);

router
    .route("/register")
    .post(
        registerRateLimiter,
        validate(registerSchema),
        authController.register,
    );

router
    .route("/resetPassword")
    .post(
        authentication,
        validate(resetPasswordSchema),
        authController.resetPassword,
    );

export default router;
