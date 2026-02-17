import partService from "../services/partService.js";
import asyncHandler from "../utils/asyncHandler.js";

const checkId = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const part = await partService.getPartById(id);

    res.locals.part = part;
    next();
});

const getAllParts = asyncHandler(async (req, res, next) => {
    const parts = await partService.getAllParts();

    res.status(200).json({
        status: "success",
        data: [...parts],
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
    const part = res.locals.part;

    res.status(200).json({
        status: "success",
        data: part,
    });
};

const updatePart = asyncHandler(async (req, res, next) => {
    const part = res.locals.part;
    const updatedPart = await partService.updatePart(part, req.body);

    res.status(200).json({
        status: "success",
        data: updatedPart,
    });
});

const deletePart = asyncHandler(async (req, res, next) => {
    const part = res.locals.part;
    await partService.deletePart(part);

    res.status(204).send();
});

export {
    checkId,
    getAllParts,
    createPart,
    getPartById,
    updatePart,
    deletePart,
};
