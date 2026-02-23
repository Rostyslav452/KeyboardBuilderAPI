import db from "../models/index.js";
import AppError from "../utils/appError.js";
import { env } from "../config/env.js";

class AuthService {
    async #generateAndSaveRefreshToken(payload, log) {
        log.info({ payload }, "Generate refresh token attempt started ");
        const expiresInDays = env.EXPIRES_IN_REFRESH_TOKEN;
        const expiresAt = new Date();
        let token;

        token = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
            expiresIn: `${expiresInDays}d`,
        });

        await db.Token.create({
            username: payload.username,
            refreshToken: token,
            expiresAt: expiresAt.setDate(expiresAt.getDate() + expiresInDays),
        });

        log.info({ payload }, "Refresh token generated and saved successfully");

        return token;
    }

    #generateAccessToken(payload, log) {
        log.info({ payload }, "Generate access token attempt started ");

        const token = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
            expiresIn: "2h",
        });

        log.info({ payload }, "Access token generated successful ");

        return token;
    }

    async register(userData, log) {
        const { username, password } = userData;

        log.info({ username }, "Registration attempt started");

        const candidate = await db.User.findByPk(username);

        if (candidate) {
            log.warn({ username }, "Registration failed: User already exist");
            throw new AppError(
                `User with this username ${username} has already exist`,
                409,
            );
        }

        await db.User.create({ username, password });

        const payload = { username }; //role: user, admin

        const refreshToken = await this.#generateAndSaveRefreshToken(
            payload,
            log,
        );
        const accessToken = await this.#generateAccessToken(payload, log);

        log.info({ payload }, "Registration successful");

        return { ...payload, accessToken, refreshToken };
    }

    async login(userData, log) {
        const { username, password } = userData;

        log.info({ username }, "Login attempt started");
        const user = await db.User.findByPk(username);

        if (!user) {
            log.warn({ username }, "Login failed: User not found");
            throw new AppError("Invalid credentials", 401);
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            log.warn({ username }, "Login failed: Incorrect password");
            throw new AppError("Invalid credentials", 401);
        }

        const payload = { username }; //role: user,admin
        const accessToken = this.#generateAccessToken(payload, log);
        const refreshToken = this.#generateAccessToken(payload, log);

        log.info({ username }, "Login successful");
        return { ...payload, accessToken, refreshToken };
    }

    async resetPassword(userData, log) {
        const { password, username, newPassword } = userData;

        log.info({ username }, "Reset password attempt started");

        const user = await db.User.findByPk(username);

        if (!user) {
            log.warn({ username }, "Reset password failed: User not found");
            throw new AppError("Invalid credentials", 401);
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            log.warn(
                { username },
                "Reset password failed: Incorrect old password ",
            );
            throw new AppError("Invalid credentials", 401);
        }

        await user.update({ password: newPassword });

        await db.Token.destroy({
            where: {
                username: username,
            },
        });

        log.info({ username }, "Reset password successful");
    }

    logout = async (refreshToken, log) => {
        if (!refreshToken) {
            return;
        }

        await db.Token.destroy({
            where: {
                refreshToken: refreshToken,
            },
        });

        log.info("Logout successful: token removed from DB");
    };

    token = async (refreshToken, log) => {
        log.info("Refresh token generation attempt");

        if (!refreshToken) {
            throw new AppError("No refresh token provided", 401);
        }

        const tokenInDb = await db.Token.findOne({
            where: { refreshToken: refreshToken },
        });

        if (!tokenInDb) {
            log.warn("Token not found in database (revoked or invalid)");
            throw new AppError("Refresh token not exist", 401);
        }

        try {
            const encodedData = await jwt.verify(
                refreshToken,
                env.REFRESH_TOKEN_SECRET,
            );

            const payload = { username: encodedData.username };
            log.info(payload, "Refresh token verify successfully");

            const accessToken = await this.#generateAccessToken(payload, log);
            return { ...payload, accessToken };
        } catch (err) {
            throw new AppError(
                "Invalid or expired session. Please log in.",
                401,
                err,
            );
        }
    };
}

export default new AuthService();
