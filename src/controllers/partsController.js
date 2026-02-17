import partService from "../services/partService.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAllParts = asyncHandler(async (req, res, next) => {
    const parts = await partService.getAllParts();

    res.status(200).json({
        status: "success",
        data: parts,
    });
});

const createPart = asyncHandler(async (req, res, next) => {
    const newPart = await partService.createPart(req.body);

    res.status(201).json({
        status: "success",
        data: newPart,
    });
});

const getPartById = (req, res, next) => {
    const part = partService.getPartById(req.params.id);

    res.status(200).json({
        status: "success",
        data: part,
    });
};

const updatePart = asyncHandler(async (req, res, next) => {
    const updatedPart = await partService.updatePart(req.params.id, req.body);

    res.status(200).json({
        status: "success",
        data: updatedPart,
    });
});

const deletePart = asyncHandler(async (req, res, next) => {
    await partService.deletePart(req.params.id);

    res.status(204).send();
});

export {
    getAllParts,
    createPart,
    getPartById,
    updatePart,
    deletePart,
};
