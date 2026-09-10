import express from 'express';
import * as partsController from '../controllers/parts.controller.js';
import authentication from '../middlewares/authentication.js';

const router = express.Router();

router
   .route('/')
   .get(partsController.getAllParts)
   .post(authentication, partsController.createParts);

router
   .route('/:id')
   .get(partsController.getPartById)
   .patch(authentication, partsController.updatePart)
   .delete(authentication, partsController.deletePart);

export default router;
