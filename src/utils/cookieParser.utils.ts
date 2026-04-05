import AppError from "@/core/AppError.js";
import { Request } from "express";

export const getRefreshTokenOrThrow = (req: Request): string => {
    const token = req.cookies.refreshToken;

    if (typeof token !== "string") {
        throw new AppError("No refresh token provided or invalid format", 401);
    }

    return token;
};
