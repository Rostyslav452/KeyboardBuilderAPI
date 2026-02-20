import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import env from "../config/env.js";
import corsOptions from "../config/cors.js";
import AppError from "./utils/appError.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRouter from "./routers/authRouter.js";
import partsRouter from "./routers/partsRouter.js";
import buildsRouter from "./routers/buildsRouter.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.js";
import { requestLogger } from "./middlewares/requestLogger.js";

const app = express();

app.use(helmet());

if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(cors(corsOptions));
app.use(globalRateLimiter);

app.use(express.json());

app.use(requestLogger);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/parts", partsRouter);
app.use("/api/v1/builds", buildsRouter);

app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
