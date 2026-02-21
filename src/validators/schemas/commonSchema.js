import { z } from "zod";

const paramsIdSchema = z.object({
    params: z.object({
        id: z
            .string({ required_error: "ID is required" })
            .uuid({ message: "Invalid ID format" }),
    }),
});

const queryFilteringSchema = z.object({
    query: z.object({
        limit: z.coerce.number().positive().default(10),
        offset: z.coerce.number().nonnegative().default(0),
        sort: z.enum(["ASC", "DESC"]).default("ASC"),
    }),
});

const paramsUsernameSchema = z.object({
    username: z
        .string({
            invalid_type_error: "Username must be a string",
            required_error: "Username is required",
        })
        .min(3, { message: "Username must be at least 3 characters" })
        .max(32, { message: "Username must be less than 32 character long" }),
});

export { paramsIdSchema, paramsUsernameSchema, queryFilteringSchema };
