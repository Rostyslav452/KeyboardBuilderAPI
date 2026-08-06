import express from 'express';
import * as partsController from '../controllers/parts.controller.js';
import validate from '../middlewares/validation.js';
import { updatePartSchema, createPartSchema } from '../schemas/part.schema.js';
import { paramsIdSchema, queryPaginationSchema } from '../schemas/common.schema.js';
import authentication from '../middlewares/authentication.js';

const router = express.Router();

router
    .route('/')
    .get(validate(queryPaginationSchema), partsController.getAllParts)
    .post(authentication, validate(createPartSchema), partsController.createPart);

router
    .route('/:id')
    .get(validate(paramsIdSchema), partsController.getPartById)
    .patch(authentication, validate(updatePartSchema), partsController.updatePart)
    .delete(authentication, validate(paramsIdSchema), partsController.deletePart);

export default router;
