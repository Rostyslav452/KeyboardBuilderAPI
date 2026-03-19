import { z } from "zod";

const paramsIdSchema = z.object({
    params: z.object({
        id: z.string().uuid({ message: "Invalid ID format" }),
    }),
});

const queryPaginationSchema = z.object({
    query: z.object({
        limit: z.coerce.number().positive().default(10),
        offset: z.coerce.number().nonnegative().default(0),
        sort: z.enum(["ASC", "DESC"]).default("ASC"),
    }),
});

const paramsUsernameSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(32, { message: "Username must be less than 32 character long" }),
});

type ParamsIdDto = z.infer<typeof paramsIdSchema>["params"];
type QueryPaginationDto = z.infer<typeof queryPaginationSchema>["query"];
type ParamsUsernameDto = z.infer<typeof paramsUsernameSchema>;

export {
    ParamsIdDto,
    QueryPaginationDto,
    ParamsUsernameDto,
    paramsIdSchema,
    paramsUsernameSchema,
    queryPaginationSchema,
};
