import authService from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

const expiresInDays = env.EXPIRES_IN_REFRESH_TOKEN;
const maxAge = expiresInDays * 1000 * 60 * 60 * 24;
const cookieOptions = {
    maxAge,
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
};

const register = asyncHandler(async (req, res, next) => {
    const user = await authService.register(req.body, req.log);

    res.cookie("refreshToken", user.refreshToken, cookieOptions);
    res.status(201).json({
        status: "success",
        data: {
            username: user.username,
        },
        accessToken: user.accessToken,
    });
});

const login = asyncHandler(async (req, res, next) => {
    const user = await authService.login(req.body, req.log);

    res.cookie("refreshToken", user.refreshToken, cookieOptions);
    res.status(200).json({
        status: "success",
        data: {
            username: user.username,
        },
        accessToken: user.accessToken,
    });
});

const logout = asyncHandler(async (req, res, next) => {
    await authService.logout(req.body, req.log);

    res.sendStatus(204);
});

const resetPassword = asyncHandler(async (req, res, next) => {
    const user = await authService.resetPassword(req.body, req.user, req.log);

    res.status(200).json({
        status: "success",
        message: "Password has been changed successfully",
        data: {
            username: user.username,
        },
    });
});

const token = asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.body;
    const user = await authService.token(refreshToken, req.log);

    res.status(201).json({
        status: "success",
        data: {
            username: user.username,
        },
        accessToken: user.accessToken,
    });
});
export { register, login, logout, token, resetPassword };
