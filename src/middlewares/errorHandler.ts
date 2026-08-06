import { Response, Request, NextFunction } from 'express';
import { env } from '../config/env.js';
import logger from '../config/logger.js';
import AppError from '../core/AppError.js';

type ErrorLike = {
    statusCode: number;
    status: 'fail' | 'error';
    message: string;
    isOperational: boolean;
    stack?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return value === 'object' && value !== null;
}

function toErrorLike(err: unknown): ErrorLike {
    if (err instanceof AppError) {
        return {
            statusCode: err.statusCode,
            status: err.status as 'fail' | 'error',
            message: err.message,
            isOperational: true,
            stack: err.stack,
        };
    }
    if (err instanceof Error) {
        const statusCode =
            isRecord(err) && typeof err.statusCode === 'number' && Number.isFinite(err.statusCode)
                ? err.statusCode
                : 500;
        const status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        return {
            statusCode,
            status,
            message: err.message || 'Unexpected error',
            isOperational: false,
            stack: err.stack,
        };
    }
    return {
        statusCode: 500,
        status: 'error',
        message: typeof err === 'string' ? err : 'Unknown error',
        isOperational: false,
    };
}

const sendErrorDev = (err: ErrorLike, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

const sendErrorProd = (err: ErrorLike, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Unknown error',
        });
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    const normalized = toErrorLike(err);

    if (env.NODE_ENV === 'development') {
        sendErrorDev(normalized, res);
    } else {
        sendErrorProd(normalized, res);
    }

    const log = req.log || logger;
    log.error(
        {
            message: normalized.message,
            statusCode: normalized.statusCode,
            isOperational: normalized.isOperational,
            path: req.originalUrl,
            method: req.method,
            stack: normalized.stack,
        },
        'Request error',
    );
};

export default errorHandler;
