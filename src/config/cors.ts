import AppError from '../core/AppError.js';
import { CorsOptions } from 'cors';
import { env } from './env.js';

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || env.ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new AppError('', 403));
        }
    },

    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

export default corsOptions;
