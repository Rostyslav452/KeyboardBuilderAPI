import express from "express";
import * as buildsController from "../controllers/buildsController.js";
import validate from "../middlewares/validateMiddleware.js";
import {
    createBuildSchema,
    updateBuildSchema,
} from "../schemas/buildSchema.js";
import {
    paramsIdSchema,
    queryPaginationSchema,
} from "../schemas/commonSchema.js";
import authentication from "../middlewares/authMiddleware.js";

const router = express.Router();

router
    .route("/")
    .get(validate(queryPaginationSchema), buildsController.getAllBuilds)
    .post(
        authentication,
        validate(createBuildSchema),
        buildsController.createBuild,
    );

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

router
    .route("/user")
    .get(authentication, buildsController.getBuildsByUser);

export default router;
