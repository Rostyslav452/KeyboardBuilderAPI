import { z } from "zod";
import { paramsIdSchema } from "./commonSchema";

const buildPayload = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: "Name must be a string",
                required_error: "Name is required",
            })
            .min(3, { message: "Name too should be at least 3 character" })
            .max(64, { message: " Name too long" }),
        username: z
            .string({
                required_error: "Username is required",
                invalid_type_error: "Username should be a string",
            })
            .min(3, { message: "Username too should be at least 3 character" })
            .max(64, { message: " Username too long" }),
        switchId: z
            .string({ required_error: "ID is required" })
            .uuid({ message: "Invalid switch ID format" }),
        caseId: z
            .string({ required_error: "ID is required" })
            .uuid({ message: "Invalid case ID format" }),
        pcbId: z
            .string({ required_error: "ID is required" })
            .uuid({ message: "Invalid PCB ID format" }),
        keycapId: z
            .string({ required_error: "ID is required" })
            .uuid({ message: "Invalid keycap ID format" }),
    }),
});

const createBuildSchema = z.object({
    body: buildPayload,
});

const updateBuildSchema = z.object({
    ...paramsIdSchema.shape,
    body: buildPayload.partial(),
});

export { createBuildSchema, updateBuildSchema };
