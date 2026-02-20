import AppError from "../utils/appError.js";
import { env } from "./env.js";

const corsOptions = {
    origin: (origin, callback) => {
        if (env.ALLOWED_ORIGINS.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new AppError("", 403));
        }
    },
    
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsOptions;
