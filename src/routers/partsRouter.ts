import express from "express";
import * as partsController from "../controllers/partsController.js";
import validate from "../middlewares/validateMiddleware.js";
import { updatePartSchema, createPartSchema } from "../schemas/partSchema.js";
import {
    paramsIdSchema,
    queryPaginationSchema,
} from "../schemas/commonSchema.js";
import authentication from "../middlewares/authMiddleware.js";

const router = express.Router();

router
    .route("/")
    .get(validate(queryPaginationSchema), partsController.getAllParts)
    .post(
        authentication,
        validate(createPartSchema),
        partsController.createPart,
    );

router
    .route("/:id")
    .get(validate(paramsIdSchema), partsController.getPartById)
    .patch(
        authentication,
        validate(updatePartSchema),
        partsController.updatePart,
    )
    .delete(
        authentication,
        validate(paramsIdSchema),
        partsController.deletePart,
    );

export default router;
