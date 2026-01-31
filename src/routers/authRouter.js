import express from "express";
import partsController from "../controllers/partsController";
const router = express.Router();

router.params("id"); //ValidateId

router.route("/").get(getAllParts).post(createPart);

router.route("/:id").get(getPartById).patch(updatePart).delete(deletePart);
