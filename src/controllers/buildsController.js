import asyncHandler from "../utils/asyncHandler.js";
import buildService from "../services/buildService.js";

const getAllBuilds = asyncHandler(async (req, res, next) => {
    const { limit, offset, sort } = req.query;
    const builds = await buildService.getAllBuilds({
        limit: Number(limit) || 10,
        offset: Number(offset) || 0,
        sort: sort || "ASC",
    });

    res.status(200).json({
        status: "success",
        data: builds,
    });
});

const getBuildById = asyncHandler(async (req, res, next) => {
    const build = buildService.getBuildById(req.params.id);

    res.status(200).json({
        status: "success",
        data: build,
    });
});

const createBuild = asyncHandler(async (req, res, next) => {
    const newBuild = await buildService.createBuild(req.body);

    res.status(201).json({
        status: "success",
        data: newBuild,
    });
});

const updateBuild = asyncHandler(async (req, res, next) => {
    const build = await buildService.updateBuild(req.params.id, req.body);

    res.status(200).json({
        status: "success",
        data: build,
    });
});

const deleteBuild = asyncHandler(async (req, res, next) => {
    await buildService.deleteBuild(req.params.id);

    res.status(204).send();
});

const getBuildsByUser = asyncHandler(async (req, res, next) => {
    const { username } = req.params;
    const builds = await buildService.getBuildsByUser(username);

    res.status(200).json({
        status: "success",
        data: builds,
    });
});

export {
    getAllBuilds,
    createBuild,
    getBuildById,
    updateBuild,
    deleteBuild,
    getBuildsByUser,
};
