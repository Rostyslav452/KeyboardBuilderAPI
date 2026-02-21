import express from "express";
import * as partsController from "../controllers/partsController.js";
import validate from "../middlewares/validateMiddleware.js";
import {
    updatePartSchema,
    createPartSchema,
} from "../validators/schemas/partSchema.js";
import {
    paramsIdSchema,
    queryFilteringSchema,
} from "../validators/schemas/commonSchema.js";

const router = express.Router();

router
    .route("/")
    .get(validate(queryFilteringSchema), partsController.getAllParts)
    .post(validate(createPartSchema), partsController.createPart);

router
    .route("/:id")
    .get(validate(paramsIdSchema), partsController.getPartById)
    .patch(validate(updatePartSchema), partsController.updatePart)
    .delete(validate(paramsIdSchema), partsController.deletePart);

export default router;
