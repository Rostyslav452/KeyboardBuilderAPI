import authService from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";

const register = asyncHandler(async (req, res, next) => {
    const user = await authService.register(req.body, req.log);

    res.status(201).json({
        status: "success",
        username: user.username,
    });
});

const login = asyncHandler(async (req, res, next) => {
    const user = await authService.login(req.body, req.log);

    res.status(200).json({
        status: "success",
        username: user.username,
    });
});

const resetPassword = asyncHandler(async (req, res, next) => {
    const user = await authService.resetPassword(req.body, req.log);

    res.status(200).json({
        status: "success",
        message: "Password has been changed successfully",
        username: user.username,
    });
});

export { register, login, resetPassword };
