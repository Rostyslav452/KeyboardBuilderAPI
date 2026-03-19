import { env } from "../config/env.js";
import AppError from "../core/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const authentication = asyncHandler(async (req, res, next) => {
    let token = req.headers["authorization"];

    req.log.info("Receive token to authentication");

    if (!token) {
        req.log.warn("Error authentication, empty token");
        throw new AppError("Error authentication, empty token", 401);
    }

    if (token.startsWith("Bearer")) {
        token = token.split(" ")[1].trim();
    }

    try {
        const decodedData = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

        res.locals.user = { username: decodedData.username };

        req.log.info(
            { username: res.locals.user.username },
            "User authenticated successfully",
        );

        next();
    } catch (error) {
        throw new AppError(
            "Invalid or expired token. Please log in again.",
            401,
            error,
        );
    }
});

export default authentication;
