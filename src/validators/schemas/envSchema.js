import { z } from "zod";

const envSchema = z.object({
    DB_NAME: z
        .string({
            required_error: "DB_NAME is required",
            invalid_type_error: "DB_NAME must be a string",
        })
        .min(1)
        .max(32),
    DB_USERNAME: z
        .string({
            required_error: "DB_USERNAME is required",
            invalid_type_error: "DB_USERNAME must be a string",
        })
        .min(1)
        .max(32),
    DB_PASSWORD: z
        .string({
            required_error: "DB_PASSWORD is required",
            invalid_type_error: "DB_PASSWORD must be a string",
        })
        .min(1),
});

export default envSchema;
