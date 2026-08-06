import partService from '../services/part.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ParamsIdDto, QueryPaginationDto } from '../schemas/common.schema.js';
import { APIResponse } from '../types/api.type.js';
import { Part } from '../models/part.model.js';
import { CreatePartDto, UpdatePartDto } from '../schemas/part.schema.js';

const getAllParts = asyncHandler(async (req, res) => {
    const query = res.locals.query as QueryPaginationDto;
    const parts = await partService.getAllParts(query);

    res.status(200).json({
        status: 'success',
        data: parts,
    } satisfies APIResponse<Part[]>);
});

const getPartById = asyncHandler(async (req, res) => {
    const { id } = res.locals.params as ParamsIdDto;
    const part = await partService.getPartById(id);

    res.status(200).json({
        status: 'success',
        data: part,
    } satisfies APIResponse<Part>);
});

const createPart = asyncHandler(async (req, res) => {
    const body = res.locals.body as CreatePartDto[];
    const part = await partService.createPart(body);

    res.status(201).json({
        status: 'success',
        data: part,
    } satisfies APIResponse<Part[]>);
});

const updatePart = asyncHandler(async (req, res) => {
    const { id } = res.locals.params as ParamsIdDto;
    const body = res.locals.body as UpdatePartDto;

    const part = await partService.updatePart(id, body);

    res.status(200).json({
        status: 'success',
        data: part,
    } satisfies APIResponse<Part>);
});

const deletePart = asyncHandler(async (req, res) => {
    const { id } = res.locals.params as ParamsIdDto;
    await partService.deletePart(id);

    res.sendStatus(204);
});

export { getAllParts, createPart, getPartById, updatePart, deletePart };
