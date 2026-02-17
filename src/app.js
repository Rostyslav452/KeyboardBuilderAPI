import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import Limiter from "express-rate-limit";
import AppError from "./utils/appError.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRouter from "./routers/authRouter.js";
import partsRouter from "./routers/partsRouter.js";
import buildsRouter from "./routers/buildsRouter.js";
dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",").map((origin) =>
    origin.trim(),
);

app.use(
    cors({
        origin: (origin, callback) => {
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(
                    new AppError(
                        `CORS error: Origin ${origin} not allowed`,
                        403,
                    ),
                );
            }
        },
        methods: ["POST", "GET", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(helmet());

const limiter = new rateLimiter({
    windowMs: 1000 * 60 * 5,
    limit: 1000,
    standardHeaders: "draft-7",
    handler: () => new AppError("You have reached limit of requests", 429),
    skip: (req, res) => {
        return req.ip === "127.0.0.1";
    },
});

app.use(limiter);

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/parts", partsRouter);
app.use("/api/v1/build", buildsRouter);

app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
