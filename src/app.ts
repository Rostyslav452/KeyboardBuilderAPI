import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import corsOptions from "./config/cors.js";
import AppError from "./core/AppError.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRouter from "./routers/auth.router.js";
import partsRouter from "./routers/parts.router.js";
import buildsRouter from "./routers/builds.router.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.js";
import requestLogger from "./middlewares/requestLogger.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(cors(corsOptions));
app.use(globalRateLimiter);

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/parts", partsRouter);
app.use("/api/v1/builds", buildsRouter);

app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
