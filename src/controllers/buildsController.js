import asyncHandler from "../utils/asyncHandler.js";
import buildService from "../services/buildService.js";

const checkId = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const build = await buildService.getBuildById(id);

    res.locals.build = build;
    next();
});

const getAllBuilds = asyncHandler(async (req, res, next) => {
    const builds = await buildService.getAllBuilds();

    res.status(200).json({
        status: "success",
        data: builds,
    });
});

const createBuild = asyncHandler(async (req, res, next) => {
    const newBuild = await buildService.createBuild(req.body);

    res.status(201).json({
        status: "success",
        data: newBuild,
    });
});

const getBuildById = asyncHandler(async (req, res, next) => {
    const build = res.locals.build;

    res.status(200).json({
        status: "success",
        data: build,
    });
});

const updateBuild = asyncHandler(async (req, res, next) => {
    const build = res.locals.build;
    await buildService.updateBuild(build, req.body);

    res.status(200).json({
        status: "success",
        data: build,
    });
});

const deleteBuild = asyncHandler(async (req, res, next) => {
    const build = res.locals.build;
    await buildService.deleteBuild(build);

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
    checkId,
    getAllBuilds,
    createBuild,
    getBuildById,
    updateBuild,
    deleteBuild,
    getBuildsByUser,
};
