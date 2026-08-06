import db from '../models/index.js';
import AppError from '../core/AppError.js';
import { Part } from '../models/part.model.js';
import { QueryPaginationDto } from '../schemas/common.schema.js';
import { CreatePartDto, UpdatePartDto } from '../schemas/part.schema.js';

class PartService {
    async getPartById(id: string): Promise<Part> {
        const part = await db.Part.findByPk(id);

        if (!part) {
            throw new AppError(`Part with ID ${id} not found`, 404);
        }

        return part;
    }

    async getAllParts({ limit, offset, sort }: QueryPaginationDto): Promise<Part[]> {
        return await db.Part.findAll({
            order: [['name', sort]],
            limit: limit,
            offset: offset,
        });
    }

    async createPart(data: CreatePartDto[]): Promise<Part[]> {
        return await db.Part.bulkCreate(data);
    }

    async updatePart(id: string, updatedData: UpdatePartDto): Promise<Part> {
        const part = await this.getPartById(id);

        return await part.update(updatedData);
    }

    async deletePart(id: string): Promise<void> {
        const part = await this.getPartById(id);

        await part.destroy();
    }
}

export default new PartService();
