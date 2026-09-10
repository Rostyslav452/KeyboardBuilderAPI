import { z } from 'zod';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/;

const registerBodySchema = z
   .object({
      username: z
         .string()
         .min(3, 'Username must be at least 3 character long')
         .max(32, 'Username is too long'),
      password: z
         .string()
         .min(8, 'Password must be at least 8 character long')
         .refine(password => passwordRegex.test(password)),
      confirmPassword: z.string(),
   })
   .refine(data => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
   });

const loginBodySchema = z.object({
   username: z.string().min(1, 'Username is required'),
   password: z.string().min(1, 'Password is required'),
});

const resetPasswordBodySchema = z.object({
   password: z.string().min(1, 'Password is required'),
   newPassword: z
      .string()
      .min(8, 'Password must be at least 8 character long')
      .refine(password => passwordRegex.test(password)),
});

type LoginDto = z.infer<typeof loginBodySchema>;
type RegisterDto = z.infer<typeof registerBodySchema>;
type ResetPasswordDto = z.infer<typeof resetPasswordBodySchema>;

export {
   LoginDto,
   RegisterDto,
   ResetPasswordDto,
   loginBodySchema,
   registerBodySchema,
   resetPasswordBodySchema,
};
