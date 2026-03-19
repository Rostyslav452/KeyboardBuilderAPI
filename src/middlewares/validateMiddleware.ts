import { ZodObject } from "zod";
import AppError from "../core/appError";
import { NextFunction, Response, Request } from "express";

const validate =
    (schema: ZodObject) =>
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

        if (result.data.params) res.locals.params = result.data.params as any;
        if (result.data.query) res.locals.query = result.data.query as any;
        if (result.data.body) res.locals.body = result.data.body;

        next();
    };

export default validate;
