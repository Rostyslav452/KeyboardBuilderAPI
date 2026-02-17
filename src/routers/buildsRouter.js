import express from "express";
import * as buildsController from "../controllers/buildsController.js";
import validate from "../middlewares/validateMiddleware.js";
import schema from "../validators/schemas/buildSchema.js";

const router = express.Router();

router.param("id", buildsController.checkId);

router
    .route("/")
    .get(buildsController.getAllBuilds)
    .post(validate(schema), buildsController.createBuild);

router
    .route("/:id")
    .get(buildsController.getBuildById)
    .patch(validate(schema), buildsController.updateBuild)
    .delete(buildsController.deleteBuild);

router.route("/user/:username").get(buildsController.getBuildsByUser);

export default router;
