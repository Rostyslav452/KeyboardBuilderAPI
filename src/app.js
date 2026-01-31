import express from "express";
import keyboardRouter from "./routers/keyboardRouter";

const app = express();

app.use(express.json());

app.use("/keyboard", keyboardRouter);

export { app };
