import authService from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { env } from "../config/env.js";
import { CookieOptions } from "express";
import AppError from "../core/appError.js";
import { APIResponse } from "../types/api.type.js";
import {
    LoginDto,
    RegisterDto,
    ResetPasswordDto,
} from "../schemas/authSchema.js";
import { JWTPayload } from "../types/jwt.type.js";

const expiresInDays = env.EXPIRES_IN_REFRESH_TOKEN;
const maxAge = expiresInDays * 1000 * 60 * 60 * 24;

const cookieOptions: CookieOptions = {
    maxAge,
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
};

const register = asyncHandler(async (req, res) => {
    const body = res.locals.body as RegisterDto;
    const user = await authService.register(body, req.log);

    res.cookie("refreshToken", user.refreshToken, cookieOptions);
    res.status(201).json({
        status: "success",
        data: {
            username: user.username,
        },
        accessToken: user.accessToken,
    } satisfies APIResponse<{ username: string }>);
});

const login = asyncHandler(async (req, res) => {
    const body = res.locals.body as LoginDto;

    const user = await authService.login(body, req.log);

    res.cookie("refreshToken", user.refreshToken, cookieOptions);
    res.status(200).json({
        status: "success",
        data: {
            username: user.username,
        },
        accessToken: user.accessToken,
    } satisfies APIResponse<{ username: string }>);
});

const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new AppError("No refresh token provided", 401);
    }

    await authService.logout(refreshToken, req.log);

    res.sendStatus(204);
});

const resetPassword = asyncHandler(async (req, res) => {
    const body = res.locals.body as ResetPasswordDto;
    const user = req.user as JWTPayload;

    const username = await authService.resetPassword(body, user, req.log);

    res.status(200).json({
        status: "success",
        message: "Password has been changed successfully",
        data: {
            username,
        },
    } satisfies APIResponse<{ username: string }>);
});

const token = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new AppError("No refresh token provided", 401);
    }

    const user = await authService.token(refreshToken, req.log);

    res.cookie("refreshToken", user.refreshToken, cookieOptions);
    res.status(201).json({
        status: "success",
        data: {
            username: user.username,
        },
        accessToken: user.accessToken,
    } satisfies APIResponse<{ username: string }>);
});

export { register, login, logout, token, resetPassword };
