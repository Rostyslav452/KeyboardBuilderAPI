import { z } from "zod";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/;

const registerSchema = z.object({
    body: z
        .object({
            username: z
                .string({
                    invalid_type_error: "Username must be a string",
                    required_error: "Username is required",
                })
                .min(3, "Username must be at least 3 character long")
                .max(32, "Username is too long"),
            password: z
                .string({
                    invalid_type_error: "Password must be a string",
                    required_error: "Password is required",
                })
                .min(8, "Password must be at least 8 character long")
                .refine((password) => passwordRegex.test(password)),
            confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords don't mutch",
            path: ["confirmPassword"],
        }),
});

const loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
    }),
});

const resetPasswordSchema = z.object({
    body: z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 character long")
            .refine((password) => passwordRegex.test(password)),
    }),
});

export { loginSchema, registerSchema, resetPasswordSchema };
