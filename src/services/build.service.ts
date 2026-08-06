import db from '../models/index.js';
import AppError from '../core/AppError.js';
import { Build } from '../models/build.model.js';
import { CreateBuildDto, UpdateBuildDto } from '../schemas/build.schema.js';
import { QueryPaginationDto } from '../schemas/common.schema.js';

class BuildService {
    async getBuildById(id: string): Promise<Build> {
        const build = await db.Build.findByPk(id, {
            attributes: { exclude: ['username'] },
            include: [
                { model: db.Part, as: 'keyboardSwitch' },
                { model: db.Part, as: 'keyboardCase' },
                { model: db.Part, as: 'keyboardPCB' },
                { model: db.Part, as: 'keyboardKeycap' },
            ],
        });

        if (!build) {
            throw new AppError(`Build with this ID ${id} not found`, 404);
        }

        return build;
    }

    async checkExistence(id: string): Promise<Build> {
        const build = await db.Build.findByPk(id);

        if (!build) {
            throw new AppError(`Build with this ID ${id} not found`, 404);
        }

        return build;
    }

    async getAllBuilds({ limit, offset, sort }: QueryPaginationDto): Promise<Build[]> {
        return await db.Build.findAll({
            attributes: { exclude: ['username'] },
            include: [
                { model: db.Part, as: 'keyboardSwitch' },
                { model: db.Part, as: 'keyboardCase' },
                { model: db.Part, as: 'keyboardPCB' },
                { model: db.Part, as: 'keyboardKeycap' },
            ],
            order: [['name', sort]],
            limit: limit,
            offset: offset,
        });
    }

    async createBuild(data: CreateBuildDto, username: string): Promise<Build> {
        return await db.Build.create({ ...data, username });
    }

    async updateBuild(id: string, updatedData: UpdateBuildDto, username: string): Promise<Build> {
        const buildInstance = await this.checkExistence(id);

        if (buildInstance.username !== username) {
            throw new AppError('Invalid username, token username not equal to body username', 403);
        }

        return await buildInstance.update(updatedData);
    }

    async deleteBuild(id: string, username: string): Promise<void> {
        const buildInstance = await this.checkExistence(id);

        if (buildInstance.username !== username) {
            throw new AppError('Invalid username, token username not equal to body username', 403);
        }

        await buildInstance.destroy();
    }

    async getBuildsByUser(username: string): Promise<Build[]> {
        const builds = await db.Build.findAll({
            attributes: { exclude: ['username'] },
            include: [
                { model: db.Part, as: 'keyboardSwitch' },
                { model: db.Part, as: 'keyboardCase' },
                { model: db.Part, as: 'keyboardPCB' },
                { model: db.Part, as: 'keyboardKeycap' },
            ],
            where: {
                username: username,
            },
        });

        if (builds.length === 0) {
            throw new AppError('No builds found for this user', 404);
        }

        return builds;
    }
}

export default new BuildService();
