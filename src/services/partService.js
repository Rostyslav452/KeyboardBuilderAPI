import { Part } from "../models/index.js";
import AppError from "../utils/appError.js";

class PartService {
    async getPartById(id) {
        const part = await Part.findByPk(id);

        if (!part) {
            throw new AppError(`Part with ID ${id} not found`, 404);
        }

        return part;
    }

    async getAllParts() {
        return await Part.findAll();
    }

    async createPart(partData) {
        return await Part.create(partData);
    }

    async updatePart(id, updatedData) {
        const part = await this.getPartById(id);

        return await part.update(updatedData);
    }

    async deletePart(id) {
        const part = await this.getPartById(id);

        return await part.destroy();
    }
}

export default new PartService();
