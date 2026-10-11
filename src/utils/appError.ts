// Use this to throw errors with a proper status code from anywhere.
// Example: throw new AppError("Invalid email or password", 401);
class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default AppError;
