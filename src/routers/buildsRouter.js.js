import express from "express";
import buildsController from "../controllers/buildsController";
const router = express.Router();

router.params("id"); //ValidateId

router
    .route("/")
    .get(buildsController.getAllParts)
    .post(buildsController.createPart);

router
    .route("/:id")
    .get(buildsController.getPartById)
    .patch(buildsController.updatePart)
    .delete(buildsController.deletePart);
