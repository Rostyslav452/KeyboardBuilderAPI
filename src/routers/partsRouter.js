import express from "express";
import * as partsController from "../controllers/partsController.js";
import validate from "../middlewares/validateMiddleware.js";
import schema from "../validators/schemas/partSchema.js";

const router = express.Router();

router.param("id", partsController.checkId);

router
    .route("/")
    .get(partsController.getAllParts)
    .post(validate(schema), partsController.createPart);

router
    .route("/:id")
    .get(partsController.getPartById)
    .patch(validate(schema), partsController.updatePart)
    .delete(partsController.deletePart);

export default router;
