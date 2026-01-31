const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        next();
    } catch (err) {
        const errors = err.error.map((error) => error.message).join(". ");

        next(new AppError(`Validation error ${errors}`, 400));
    }
};
