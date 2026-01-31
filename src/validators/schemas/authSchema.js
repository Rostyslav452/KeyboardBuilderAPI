import { z } from "zod";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]$/;

const registerSchema = z.object({
    body: z
        .object({
            username: z
                .string()
                .min(3, "Username must be at least 3 character long")
                .max(32, "Username is too long"),
            password: z
                .string()
                .min(8, "Password must be at least 8 character long")
                .refine((password) => password.test()),
            confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords don't mutch",
            path: ["confirmPassword"],
        }),
});

const confirmSchema = z.object({
    body: z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
    }),
});

export { confirmSchema, registerSchema };