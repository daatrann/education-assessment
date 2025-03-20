import { StatusCodes, ReasonPhrases } from "http-status-codes";
class MyError extends Error {
    statusCode;
    err;

    /**
     * @param {StatusCodes} statusCode
     * @param {string} message
     * @param err
     */
    constructor(statusCode, message, err) {
        super(message);
        this.statusCode = statusCode;
        this.err = err;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends MyError {
    constructor(err) {
        super(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_GATEWAY, err);
    }
}

export class UnauthorizedError extends MyError {
    constructor(err) {
        super(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, err);
    }
}

export class DataExistsError extends MyError {
    constructor(err = "Data exited") {
        super(StatusCodes.CONFLICT, ReasonPhrases.BAD_REQUEST, err);
    }
}

export class ErrorNotFound extends MyError {
    constructor(err = "Not found") {
        super(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, err);
    }
}

export class ForbiddenError extends MyError {
    constructor(err = "Forbidden") {
        super(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN, err);
    }
}
