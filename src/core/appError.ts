interface IAppError {
    message: string;
    statusCode: number;
    isOperational: boolean;
    err?: any;
}

class AppError extends Error implements IAppError {
    public status: string;
    public readonly isOperational: boolean;

    constructor(
        public readonly message: string,
        public statusCode: number,
        public readonly err: any = null,
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
