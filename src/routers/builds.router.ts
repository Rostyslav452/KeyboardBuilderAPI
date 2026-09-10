import express from 'express';
import * as buildsController from '../controllers/builds.controller.js';
import authentication from '../middlewares/authentication.js';

const router = express.Router();

router
   .route('/')
   .get(buildsController.getAllBuilds)
   .post(authentication, buildsController.createBuild);

router.route('/me').get(authentication, buildsController.getBuildsByUser);

router
   .route('/:id')
   .get(buildsController.getBuildById)
   .patch(authentication, buildsController.updateBuild)
   .delete(authentication, buildsController.deleteBuild);

export default router;
