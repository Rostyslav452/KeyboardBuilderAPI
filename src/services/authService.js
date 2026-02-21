import db from "../models/index.js";
import AppError from "../utils/appError.js";

class AuthService {
    async register(userData, log) {
        const { username, password } = userData;

        log.info({ username }, "Registration attempt started");

        try {
            const candidate = await db.User.findByPk(username);

            if (candidate) {
                log.warn(
                    { username },
                    "Registration failed: User already exist",
                );
                throw new AppError(
                    `User with this username ${username} has already exist`,
                    409,
                );
            }

            const newUser = await db.User.create({ username, password });

            log.info({ id: newUser.id, username }, "Registration successful");

            return newUser;
        } catch (err) {
            if (!err.isOperational) {
                log.error(
                    { err, username },
                    "Database error during registration",
                );
            }
            throw err;
        }
    }

    async login(userData, log) {
        const { username, password } = userData;

        try {
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

            log.info({ id: user.id, username }, "Login successful");
            return user;
        } catch (err) {
            if (!err.isOperational) {
                log.error({ err, username }, "Database error during login");
            }
            throw err;
        }
    }

    async resetPassword(userData, log) {
        const { password, username, newPassword } = userData;

        try {
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

            const updatedUser = await user.update({ password: newPassword });

            log.info(
                { id: updatedUser.id, username },
                "Reset password successful",
            );
            return user;
        } catch (err) {
            if (!err.isOperational) {
                log.error(
                    { err, username },
                    "Database error during reset password",
                );
            }
            throw err;
        }
    }
}

export default new AuthService();
