import express from "express";
import * as buildsController from "../controllers/builds.controller.js";
import validate from "../middlewares/validation.js";
import {
    createBuildSchema,
    updateBuildSchema,
} from "../schemas/build.schema.js";
import {
    paramsIdSchema,
    queryPaginationSchema,
} from "../schemas/common.schema.js";
import authentication from "../middlewares/authentication.js";

const router = express.Router();

router
    .route("/")
    .get(validate(queryPaginationSchema), buildsController.getAllBuilds)
    .post(
        authentication,
        validate(createBuildSchema),
        buildsController.createBuild,
    );

router.route("/user").get(authentication, buildsController.getBuildsByUser);

router
    .route("/:id")
    .get(validate(paramsIdSchema), buildsController.getBuildById)
    .patch(
        authentication,
        validate(updateBuildSchema),
        buildsController.updateBuild,
    )
    .delete(
        authentication,
        validate(paramsIdSchema),
        buildsController.deleteBuild,
    );

export default router;
