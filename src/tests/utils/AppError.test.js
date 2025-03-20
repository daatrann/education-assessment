import {
    ValidationError,
    UnauthorizedError,
    DataExistsError,
    ErrorNotFound,
} from "../../utils/AppError.js";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

describe("Custom Error Classes", () => {
    it("should create a ValidationError with correct status and message", () => {
        const errMessage = "Invalid input";
        const error = new ValidationError(errMessage);

        expect(error).toBeInstanceOf(ValidationError);
        expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
        expect(error.message).toBe("Bad Gateway");
        expect(error.err).toBe(errMessage);
    });

    it("should create an UnauthorizedError with correct status and message", () => {
        const errMessage = "Invalid credentials";
        const error = new UnauthorizedError(errMessage);

        expect(error).toBeInstanceOf(UnauthorizedError);
        expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(error.message).toBe(ReasonPhrases.UNAUTHORIZED);
        expect(error.err).toBe(errMessage);
    });

    it("should create a DataExistsError with correct status and default message", () => {
        const error = new DataExistsError();

        expect(error).toBeInstanceOf(DataExistsError);
        expect(error.statusCode).toBe(StatusCodes.CONFLICT);
        expect(error.message).toBe("Bad Request");
        expect(error.err).toBe("Data exited");
    });

    it("should create a DataExistsError with a custom error message", () => {
        const errMessage = "User already registered";
        const error = new DataExistsError(errMessage);

        expect(error.statusCode).toBe(StatusCodes.CONFLICT);
        expect(error.message).toBe("Bad Request");
        expect(error.err).toBe(errMessage);
    });

    it("should create an ErrorNotFound with correct status and default message", () => {
        const error = new ErrorNotFound();

        expect(error).toBeInstanceOf(ErrorNotFound);
        expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(error.message).toBe(ReasonPhrases.NOT_FOUND);
        expect(error.err).toBe("Not found");
    });

    it("should create an ErrorNotFound with a custom error message", () => {
        const errMessage = "Page not found";
        const error = new ErrorNotFound(errMessage);

        expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(error.message).toBe(ReasonPhrases.NOT_FOUND);
        expect(error.err).toBe(errMessage);
    });
});
