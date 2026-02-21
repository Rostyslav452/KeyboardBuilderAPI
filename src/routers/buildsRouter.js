import express from "express";
import * as buildsController from "../controllers/buildsController.js";
import validate from "../middlewares/validateMiddleware.js";
import {
    createBuildSchema,
    updateBuildSchema,
} from "../validators/schemas/buildSchema.js";
import {
    paramsIdSchema,
    paramsUsernameSchema,
    queryFilteringSchema,
} from "../validators/schemas/commonSchema.js";

const router = express.Router();

router
    .route("/")
    .get(validate(queryFilteringSchema), buildsController.getAllBuilds)
    .post(validate(createBuildSchema), buildsController.createBuild);

router
    .route("/:id")
    .get(validate(paramsIdSchema), buildsController.getBuildById)
    .patch(validate(updateBuildSchema), buildsController.updateBuild)
    .delete(validate(paramsIdSchema), buildsController.deleteBuild);

router
    .route("/user/:username")
    .get(validate(paramsUsernameSchema), buildsController.getBuildsByUser);

export default router;
