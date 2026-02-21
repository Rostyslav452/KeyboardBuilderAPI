import { z } from "zod";

const envSchema = z.object({
    DB_NAME: z.string().min(1).max(32),
    DB_USERNAME: z.string().min(1).max(32),
    DB_PASSWORD: z.string().min(1),
    DB_HOST: z.string({}).min(1),
    PORT: z.coerce.number({}).int().min(1).max(65535).default(3000),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("production"),
    ALLOWED_ORIGINS: z
        .string()
        .min(1)
        .transform((str) => str.split(",").map((origin) => origin.trim())),
    SALT_ROUNDS: z.coerce.number().min(1).max(20).default(10),
    LOG_LEVEL: z
        .enum(["silent", "trace", "debug", "info", "warn", "error", "fatal"])
        .default("info"),
});

export default envSchema;
