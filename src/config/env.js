import logger from "../utils/logger.js";
import envSchema from "../validators/schemas/envSchema.js";
import dotenv from "dotenv";

dotenv.config();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    const log = logger.child({ module: "ENV_ERROR_VALIDATION" });
    log.error(
        { errors: parsedEnv.error.flatten() },
        "Invalid environment variables",
    );

    process.exit(1);
}

export const env = parsedEnv.data;
