import { Part, Build } from "../models/index.js";
import AppError from "../utils/appError.js";

class BuildService {
    async getBuildById(id) {
        const build = await Build.findByPk(id, {
            attributes: { exclude: ["username"] },
            include: [
                { model: Part, as: "keyboardSwitch" },
                { model: Part, as: "keyboardCase" },
                { model: Part, as: "keyboardPCB" },
                { model: Part, as: "keyboardKeycap" },
            ],
        });

        if (!build) {
            throw new AppError(`Build with this ID ${id} not found`, 404);
        }

        return build;
    }

    async checkExistence(id) {
        const build = await Build.findByPk(id);

        if (!build) {
            throw new AppError(`Build with this ID ${id} not found`, 404);
        }

        return build;
    }

    async getAllBuilds() {
        return await Build.findAll({
            attributes: { exclude: ["username"] },
            include: [
                { model: Part, as: "keyboardSwitch" },
                { model: Part, as: "keyboardCase" },
                { model: Part, as: "keyboardPCB" },
                { model: Part, as: "keyboardKeycap" },
            ],
        });
    }

    async createBuild(buildData) {
        return await Build.create(buildData);
    }

    async updateBuild(buildInstance, updatedData) {
        return await buildInstance.update(updatedData);
    }

    async deleteBuild(buildInstance) {
        return await buildInstance.destroy();
    }

    async getBuildsByUser(username) {
        const builds = await Build.findAll({
            attributes: { exclude: ["username"] },
            include: [
                { model: Part, as: "keyboardSwitch" },
                { model: Part, as: "keyboardCase" },
                { model: Part, as: "keyboardPCB" },
                { model: Part, as: "keyboardKeycap" },
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
