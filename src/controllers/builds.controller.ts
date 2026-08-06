import asyncHandler from '../utils/asyncHandler.js';
import buildService from '../services/build.service.js';
import { Build } from '../models/build.model.js';
import { APIResponse } from '../types/api.type.js';
import { CreateBuildDto, UpdateBuildDto } from '../schemas/build.schema.js';
import { ParamsIdDto, QueryPaginationDto } from '../schemas/common.schema.js';

const getAllBuilds = asyncHandler(async (req, res) => {
    const query = res.locals.query as QueryPaginationDto;
    const builds = await buildService.getAllBuilds(query);

    res.status(200).json({
        status: 'success',
        data: builds,
    } satisfies APIResponse<Build[]>);
});

const getBuildById = asyncHandler(async (req, res) => {
    const { id } = res.locals.params as ParamsIdDto;
    const build = await buildService.getBuildById(id);

    res.status(200).json({
        status: 'success',
        data: build,
    } satisfies APIResponse<Build>);
});

const createBuild = asyncHandler(async (req, res) => {
    const body = res.locals.body as CreateBuildDto;
    const username = req.user!.username;

    const newBuild = await buildService.createBuild(body, username);

    res.status(201).json({
        status: 'success',
        data: newBuild,
    } satisfies APIResponse<Build>);
});

const updateBuild = asyncHandler(async (req, res) => {
    const { id } = res.locals.params as ParamsIdDto;
    const body = res.locals.body as UpdateBuildDto;
    const username = req.user!.username;

    const build = await buildService.updateBuild(id, body, username);
    res.status(200).json({
        status: 'success',
        data: build,
    } satisfies APIResponse<Build>);
});

const deleteBuild = asyncHandler(async (req, res) => {
    const { id } = res.locals.params as ParamsIdDto;
    const username = req.user!.username;

    await buildService.deleteBuild(id, username);

    res.sendStatus(204);
});

const getBuildsByUser = asyncHandler(async (req, res) => {
    const username = req.user!.username;

    const builds = await buildService.getBuildsByUser(username);

    res.status(200).json({
        status: 'success',
        data: builds,
    } satisfies APIResponse<Build[]>);
});

export { getAllBuilds, createBuild, getBuildById, updateBuild, deleteBuild, getBuildsByUser };
