import { z } from "zod";
import AppError from "../core/AppError.js";
import { NextFunction, Response, Request } from "express";

type ValidateRequestData = {
   body?: unknown;
   query?: unknown;
   params?: unknown;
}
const validate=
   <T extends ValidateRequestData> (schema: z.ZodType<T>) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if (!result.success) {
            const errors = result.error.issues
                .map((error) => error.message)
                .join(". ");

            req.log.warn(
                {
                    err: result.error.flatten(),
                },
                "Validation error",
            );
            next(new AppError(`Validation error ${errors}`, 400));
            return;
        }

        if (result.data.params) res.locals.params = result.data.params
        if (result.data.query) res.locals.query = result.data.query
        if (result.data.body) res.locals.body = result.data.body;

        next();
    };

export default validate;
