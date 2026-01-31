import express from "express";
import keyboardController from "../controllers/authController.js";
const router = express.Router();

router.params("id", checkKeyboardId);

router
    .route("/")
    .get(keyboardController.getAllKeyboard)
    .post(keyboardController.createNewKeyboard);

router
    .route("/:id")
    .get(keyboardController.getKeyboardById)
    .patch(keyboardController.updateKeyboard);

export { router };
