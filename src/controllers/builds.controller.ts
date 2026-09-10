import buildService from '../services/build.service.js';
import { Build } from '../models/build.model.js';
import { APIResponse } from '../types/api.type.js';
import { createBuildBodySchema, updateBuildBodySchema } from '../schemas/build.schema.js';
import { paramsIdSchema, queryPaginationSchema } from '../schemas/common.schema.js';
import createValidatedHandler from '../utils/createValidatedHandler.js';

const getAllBuilds = createValidatedHandler(
   { query: queryPaginationSchema },
   async ({ query, res }) => {
      const builds = await buildService.getAllBuilds(query);

      res.status(200).json({
         status: 'success',
         data: builds,
      } satisfies APIResponse<Build[]>);
   },
);

const getBuildById = createValidatedHandler({ params: paramsIdSchema }, async ({ params, res }) => {
   const { id } = params;
   const build = await buildService.getBuildById(id);

   res.status(200).json({
      status: 'success',
      data: build,
   } satisfies APIResponse<Build>);
});

const createBuild = createValidatedHandler(
   { body: createBuildBodySchema },
   async ({ req, res, body }) => {
      const username = req.user!.username;

      const newBuild = await buildService.createBuild(body, username);

      res.status(201).json({
         status: 'success',
         data: newBuild,
      } satisfies APIResponse<Build>);
   },
);

const updateBuild = createValidatedHandler(
   { body: updateBuildBodySchema, params: paramsIdSchema },
   async ({ params, body, req, res }) => {
      const { id } = params;
      const username = req.user!.username;

      const build = await buildService.updateBuild(id, body, username);
      res.status(200).json({
         status: 'success',
         data: build,
      } satisfies APIResponse<Build>);
   },
);

const deleteBuild = createValidatedHandler(
   { params: paramsIdSchema },
   async ({ params, res, req }) => {
      const { id } = params;
      const username = req.user!.username;

      await buildService.deleteBuild(id, username);

      res.sendStatus(204);
   },
);

const getBuildsByUser = createValidatedHandler({}, async ({ req, res }) => {
   const username = req.user!.username;

   const builds = await buildService.getBuildsByUser(username);

   res.status(200).json({
      status: 'success',
      data: builds,
   } satisfies APIResponse<Build[]>);
});

export { getAllBuilds, createBuild, getBuildById, updateBuild, deleteBuild, getBuildsByUser };
