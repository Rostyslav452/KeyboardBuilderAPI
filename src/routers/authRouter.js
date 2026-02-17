import express from "express";
import validate from "../middlewares/validateMiddleware.js";
import {
    loginSchema,
    registerSchema,
    resetPasswordSchema,
} from "../validators/schemas/authSchema.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.route("/login").post(validate(loginSchema), authController.login);

router
    .route("/register")
    .post(validate(registerSchema), authController.register);

router
    .route("/resetPassword")
    .post(validate(resetPasswordSchema), authController.resetPassword);

export default router;
