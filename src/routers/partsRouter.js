import express from "express";
import partsController from "../controllers/partsController";
const router = express.Router();

router.params("id"); //ValidateId

router
    .route("/")
    .get(partsController.getAllParts)
    .post(partsController.createPart);

router
    .route("/:id")
    .get(partsController.getPartById)
    .patch(partsController.updatePart)
    .delete(partsController.deletePart);
