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

    async getAllParts(id) {
        return await Part.findAll();
    }

    async createPart(partData) {
        return await Part.create(partData);
    }

    async updatePart(partInstance, updatedData) {
        return await partInstance.update(updatedData);
    }

    async deletePart(partInstance) {
        return await partInstance.destroy();
    }
}

export default new PartService()
