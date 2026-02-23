class AppError extends Error {
    constructor(message, statusCode, err = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        this.err = err;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
