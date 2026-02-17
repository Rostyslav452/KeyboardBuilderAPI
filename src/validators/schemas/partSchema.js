import { z } from "zod";

const FormFactors = ["60%", "65%", "75%", "TKL", "Full-size", "96%"];
const SwitchTypes = ["Linear", "Tactile", "Clicky", "Silent"];
const Materials = ["ABS", "PBT", "Aluminum", "Polycarbonate", "Acrylic", "FR4"];

const commonFields = z.object({
    price: z
        .number({
            invalid_type_error: "Price must be a number",
            required_error: "Price is required",
        })
        .min(1, { message: "Price must be more than 1" })
        .max(99999, { message: "Price must be less than 100000" }),
    name: z
        .string({
            invalid_type_error: "Name must be a string",
            required_error: "Name is required",
        })
        .min(3, { message: "Name too should be at least 3 character" })
        .max(64, { message: " Name too long" }),
});

const switchSpecs = z.object({
    switchType: z.enum(SwitchTypes),
    pins: z.enum(["3-pin", "5-pin"]),
    actuationForce: z.number().min(10).max(100),
    travelDistance: z.number().optional(),
});

const caseSpecs = z.object({
    formFactor: z.enum(FormFactors),
    material: z.enum(Materials),
    mountStyle: z.string().optional(),
    color: z.string(),
});

const pcbSpecs = z.object({
    formFactor: z.enum(FormFactors),
    hotSwap: z.boolean(),
    rgbSupport: z.enum(["none", "per-key", "underglow"]),
    connection: z.enum(["USB-C", "Bluetooth", "2.4GHz"]).array(),
});

const keycapSpecs = z.object({
    profile: z.enum(["Cherry", "OEM", "SA", "XDA", "DSA", "MT3"]),
    material: z.enum(["ABS", "PBT"]),
    legends: z.enum(["Double-shot", "Dye-sub", "Laser-etched"]),
    language: z.array(z.string()), // ["EN", "UA"]
});

const createPartSchema = z.object({
    body: z.discriminatedUnion("type", [
        commonFields.extend({
            type: z.literal("switch"),
            specs: switchSpecs,
        }),

        commonFields.extend({
            type: z.literal("case"),
            specs: caseSpecs,
        }),

        commonFields.extend({
            type: z.literal("pcb"),
            specs: pcbSpecs,
        }),

        commonFields.extend({
            type: z.literal("keycap"),
            specs: keycapSpecs,
        }),
        ,
    ]),
});

export default createPartSchema;
