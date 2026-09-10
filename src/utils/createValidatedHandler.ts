import { ZodError, ZodType } from 'zod';
import AppError from '../core/AppError.js';
import { Response, Request, RequestHandler } from 'express';

interface RouteValidation<TBody, TQuery, TParams> {
   body?: ZodType<TBody>;
   query?: ZodType<TQuery>;
   params?: ZodType<TParams>;
}

const createValidatedHandler = <
   TBody = unknown,
   TQuery = unknown,
   TParams = unknown,
   TRes = unknown,
>(
   schemas: RouteValidation<TBody, TQuery, TParams>,
   handler: (ctx: {
      body: TBody;
      query: TQuery;
      params: TParams;
      req: Request;
      res: Response<TRes>;
   }) => Promise<void> | void,
): RequestHandler => {
   return async (req, res, next) => {
      try {
         const body = schemas.body ? await schemas.body.parseAsync(req.body) : (req.body as TBody);

         const query = schemas.query
            ? await schemas.query.parseAsync(req.query)
            : (req.query as TQuery);

         const params = schemas.params
            ? await schemas.params.parseAsync(req.params)
            : (req.params as TParams);

         await handler({ body, query, params, req, res });
      } catch (error) {
         if (error instanceof ZodError) {
            const errorsMessage = error.issues.map(error => error.message).join('. ');

            req.log.warn(
               {
                  err: error.format(),
               },
               'Validation error',
            );

            return next(new AppError(`Validation error ${errorsMessage}`, 400));
         }

         next(error);
      }
   };
};

export default createValidatedHandler;
