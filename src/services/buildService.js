import db from "../models/index.js";
import AppError from "../utils/appError.js";

class BuildService {
    async getBuildById(id) {
        const build = await db.Build.findByPk(id, {
            attributes: { exclude: ["username"] },
            include: [
                { model: db.Part, as: "keyboardSwitch" },
                { model: db.Part, as: "keyboardCase" },
                { model: db.Part, as: "keyboardPCB" },
                { model: db.Part, as: "keyboardKeycap" },
            ],
        });

        if (!build) {
            throw new AppError(`Build with this ID ${id} not found`, 404);
        }

        return build;
    }

    async checkExistence(id) {
        const build = await db.Build.findByPk(id);

        if (!build) {
            throw new AppError(`Build with this ID ${id} not found`, 404);
        }

        return build;
    }

    async getAllBuilds({ limit, offset, sort }) {
        return await db.Build.findAll({
            attributes: { exclude: ["username"] },
            include: [
                { model: db.Part, as: "keyboardSwitch" },
                { model: db.Part, as: "keyboardCase" },
                { model: db.Part, as: "keyboardPCB" },
                { model: db.Part, as: "keyboardKeycap" },
            ],
            order: [["name", sort]],
            limit: limit,
            offset: offset,
        });
    }

    async createBuild(buildData) {
        return await db.Build.create(buildData);
    }

    async updateBuild(id, updatedData) {
        const buildInstance = await this.checkExistence(id);

        return await buildInstance.update(updatedData);
    }

    async deleteBuild(id) {
        const buildInstance = await this.checkExistence(id);

        return await buildInstance.destroy();
    }

    async getBuildsByUser(username) {
        const builds = await db.Build.findAll({
            attributes: { exclude: ["username"] },
            include: [
                { model: db.Part, as: "keyboardSwitch" },
                { model: db.Part, as: "keyboardCase" },
                { model: db.Part, as: "keyboardPCB" },
                { model: db.Part, as: "keyboardKeycap" },
            ],
            where: {
                username: username,
            },
        });

        if (builds.length === 0) {
            throw new AppError("No builds found for this user", 404);
        }

        return builds;
    }
}

export default new BuildService();
