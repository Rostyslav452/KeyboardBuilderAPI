import AppError from "../utils/appError.js";

const validate = (schema) => (req, res, next) => {
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

    if (result.data.body) req.body = result.data.body;
    if (result.data.params) req.params = result.data.params;
    next();
};

export default validate;
