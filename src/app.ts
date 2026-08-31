import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { load } from 'js-yaml';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import corsOptions from './config/cors.js';
import AppError from './core/AppError.js';
import errorHandler from './middlewares/errorHandler.js';
import authRouter from './routers/auth.router.js';
import partsRouter from './routers/parts.router.js';
import buildsRouter from './routers/builds.router.js';
import { globalRateLimiter } from './middlewares/rateLimiter.js';
import requestLogger from './middlewares/requestLogger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

app.use('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use(requestLogger);

app.use(cors(corsOptions));
app.use(globalRateLimiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Load and setup Swagger documentation
const swaggerFilePath = path.join(__dirname, '../docs/swagger.yaml');
const swaggerDocument = load(fs.readFileSync(swaggerFilePath, 'utf8')) as Record<string, unknown>;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/parts', partsRouter);
app.use('/api/v1/builds', buildsRouter);

app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
