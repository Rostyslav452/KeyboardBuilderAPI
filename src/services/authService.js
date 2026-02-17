import { User } from "../models/index.js";
import AppError from "../utils/appError.js";

class AuthService {
    async register(userData) {
        const { username, password } = userData;

        const candidate = await User.findByPk(username);

        if (candidate) {
            throw new AppError(
                `User with this username ${username} has already exist`,
                409,
            );
        }

        return await User.create({ username, password });
    }

    async login(userData) {
        const { username, password } = userData;
        const user = await User.findByPk(username);

        if (!user) {
            throw new AppError("Invalid username or password", 401);
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new AppError("Invalid username or password", 401);
        }
        return user;
    }

    async resetPassword(userData) {
        const { password, username, newPassword } = userData;

        const user = await User.findByPk(username);

        if (!user) {
            throw new AppError("Username isn't found", 401);
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new AppError("Invalid password", 401);
        }

        await user.update({ password: newPassword });

        return user;
    }
}

export default new AuthService();