import partService from '../services/part.service.js';
import { APIResponse } from '../types/api.type.js';
import { Part } from '../models/part.model.js';
import createValidatedHandler from '../utils/createValidatedHandler.js';
import { paramsIdSchema, queryPaginationSchema } from '../schemas/common.schema.js';
import { createPartsBodySchema, updatePartBodySchema } from '../schemas/part.schema.js';

const getAllParts = createValidatedHandler(
   { query: queryPaginationSchema },
   async ({ query, res }) => {
      const parts = await partService.getAllParts(query);

      res.status(200).json({
         status: 'success',
         data: parts,
      } satisfies APIResponse<Part[]>);
   },
);

const getPartById = createValidatedHandler({ params: paramsIdSchema }, async ({ res, params }) => {
   const { id } = params;
   const part = await partService.getPartById(id);

   res.status(200).json({
      status: 'success',
      data: part,
   } satisfies APIResponse<Part>);
});

const createParts = createValidatedHandler(
   { body: createPartsBodySchema },
   async ({ res, body }) => {
      const parts = await partService.createParts(body);

      res.status(201).json({
         status: 'success',
         data: parts,
      } satisfies APIResponse<Part[]>);
   },
);

const updatePart = createValidatedHandler(
   { params: paramsIdSchema, body: updatePartBodySchema },
   async ({ res, params, body }) => {
      const { id } = params;
      const part = await partService.updatePart(id, body);

      res.status(200).json({
         status: 'success',
         data: part,
      } satisfies APIResponse<Part>);
   },
);

const deletePart = createValidatedHandler({ params: paramsIdSchema }, async ({ res, params }) => {
   const { id } = params;

   await partService.deletePart(id);

   res.sendStatus(204);
});

export { getAllParts, createParts, getPartById, updatePart, deletePart };
