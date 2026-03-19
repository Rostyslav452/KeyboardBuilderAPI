import asyncHandler from "../utils/asyncHandler.js";
import buildService from "../services/buildService.js";
import { Build } from "../models/build.model.js";
import { APIResponse } from "../types/api.type.js";
import { CreateBuildDto, UpdateBuildDto } from "../schemas/buildSchema.js";
import { QueryPaginationDto } from "../schemas/commonSchema.js";

const getAllBuilds = asyncHandler(async (req, res, next) => {
    const query = res.locals.query as QueryPaginationDto;
    const builds = await buildService.getAllBuilds(query);

    res.status(200).json({
        status: "success",
        data: builds,
    } satisfies APIResponse<Build[]>);
});

const getBuildById = asyncHandler(async (req, res, next) => {
    const id = res.locals.params.id as string;
    const build = await buildService.getBuildById(id);

    res.status(200).json({
        status: "success",
        data: build,
    } satisfies APIResponse<Build>);
});

const createBuild = asyncHandler(async (req, res, next) => {
    const body = res.locals.body as CreateBuildDto;
    const username = res.locals.user!.username;

    const newBuild = await buildService.createBuild({
        ...body,
        username,
    });

    res.status(201).json({
        status: "success",
        data: newBuild,
    } satisfies APIResponse<Build>);
});

const updateBuild = asyncHandler(async (req, res, next) => {
    const id = res.locals.params.id as string;
    const body = res.locals.body as UpdateBuildDto;
    const username = res.locals.user!.username;

    const build = await buildService.updateBuild(id, {
        ...body,
        username,
    });

    res.status(200).json({
        status: "success",
        data: build,
    } satisfies APIResponse<Build>);
});

const deleteBuild = asyncHandler(async (req, res, next) => {
    const id = res.locals.params.id as string;
    const username = res.locals.user!.username;

    await buildService.deleteBuild(id, username);

    res.sendStatus(204);
});

const getBuildsByUser = asyncHandler(async (req, res, next) => {
    const username = res.locals.user!.username;

    const builds = await buildService.getBuildsByUser(username);

    res.status(200).json({
        status: "success",
        data: builds,
    } satisfies APIResponse<Build[]>);
});

export {
    getAllBuilds,
    createBuild,
    getBuildById,
    updateBuild,
    deleteBuild,
    getBuildsByUser,
};
