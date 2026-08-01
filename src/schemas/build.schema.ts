import { z } from "zod";
import { paramsIdSchema } from "./common.schema.js";

const buildCoreSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name too should be at least 3 character" })
        .max(64, { message: " Name too long" }),
    switchId: z.string().uuid({ message: "Invalid switch ID format" }),
    caseId: z.string().uuid({ message: "Invalid case ID format" }),
    pcbId: z.string().uuid({ message: "Invalid PCB ID format" }),
    keycapId: z.string().uuid({ message: "Invalid keycap ID format" }),
});

const createBuildSchema = z.object({
    body: buildCoreSchema,
});

const updateBuildSchema = z.object({
    params: paramsIdSchema.shape.params,
    body: buildCoreSchema.partial(),
});

type CreateBuildDto = z.infer<typeof createBuildSchema>["body"];
type UpdateBuildDto = z.infer<typeof updateBuildSchema>["body"];

export { CreateBuildDto, UpdateBuildDto, createBuildSchema, updateBuildSchema };
