import express from "express";
import cors from "cors";
import morgan from "morgan";
import AppError from "./utils/appError.js";
import errorHandler from "./utils/errorHandler.js";
import authRouter from "./routers/authRouter.js";
import partsRouter from "./routers/partsRouter.js";
import buildsRouter from "./routers/buildsRouter.js";

const app = express();

app.use(cors());

if (process.env.NODE_ENV === "develope") {
    app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/parts", partsRouter);
app.use("/api/v1/build", buildsRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
