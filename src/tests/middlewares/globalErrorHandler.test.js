// Unit tests for: globalErrorHandler
import { Prisma } from "@prisma/client";
import {
    PrismaClientInitializationError,
    PrismaClientRustPanicError,
} from "@prisma/client/runtime/library";
import env from "../../../src/config/env.js";
import { globalErrorHandler } from "../../../src/middlewares/globalErrorHandler.js";
import { jest } from "@jest/globals";

jest.mock("../../config/logger.js", () => ({
    error: jest.fn(),
}));

describe("globalErrorHandler() globalErrorHandler method", () => {
    let mockReq, mockRes, mockJson, mockStatus;
    let req, res;

    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn(() => ({ json: mockJson }));
        mockReq = {};
        mockRes = { status: mockStatus };
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    // Happy Path Tests
    test("should handle PrismaClientKnownRequestError with code P2002", () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            "Unique constraint failed",
            "P2002",
            "1"
        );
        globalErrorHandler(error, req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Prisma Error",
            error: "Prisma Error: Unique constraint failed",
        });
    });

    test("should handle PrismaClientInitializationError", () => {
        const error = new PrismaClientInitializationError(
            "Initialization failed",
            "1"
        );
        globalErrorHandler(error, mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 500,
            message: "Database connection failed.",
            error: "Initialization failed",
        });
    });

    test("should handle PrismaClientRustPanicError", () => {
        const error = new PrismaClientRustPanicError("Rust panic error", "1");
        globalErrorHandler(error, mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 500,
            message: "Unexpected database error.",
            error: "Please contact support.",
        });
    });

    test("should handle UnauthorizedError", () => {
        const error = {
            name: "UnauthorizedError",
            message: "Unauthorized access",
        };
        globalErrorHandler(error, mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 401,
            message: "Unauthorized",
            error: "You do not have permission to perform this action.",
        });
    });

    // Edge Case Tests
    test("should handle unknown PrismaClientKnownRequestError code", () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            "Unknown error",
            "P9999",
            "1"
        );
        globalErrorHandler(error, mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Prisma Error",
            error: "Prisma Error: Unknown error",
        });
    });

    test("should handle PrismaClientKnownRequestError with code P2015", () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            "Resource not found",
            "P2015",
            "1"
        );
        globalErrorHandler(error, mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Prisma Error",
            error: "Prisma Error: Resource not found",
        });
    });

    test("should handle PrismaClientKnownRequestError with code P2011", () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            "A required field is missing",
            "P2011",
            "1"
        );
        globalErrorHandler(error, mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Prisma Error",
            error: "Prisma Error: A required field is missing",
        });
    });

    test("should handle PrismaClientKnownRequestError with code P2004", () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            "Invalid data input",
            "P2004",
            "1"
        );
        globalErrorHandler(error, mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Prisma Error",
            error: "Prisma Error: Invalid data input",
        });
    });

    test("should handle default case for PrismaClientKnownRequestError", () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            "Some other error",
            "P9998",
            "1"
        );
        globalErrorHandler(error, mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Prisma Error",
            error: "Prisma Error: Some other error",
        });
    });

    test("should handle error with no statusCode and message", () => {
        const error = { err: "Some error" };
        globalErrorHandler(error, mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 500,
            message: "Internal Server Error",
            error: "Some error",
            stack: undefined,
        });
    });

    test("should include stack trace in development environment", () => {
        env.NODE_ENV = "dev";
        const error = { err: "Some error", stack: "Error stack" };
        globalErrorHandler(error, mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 500,
            message: "Internal Server Error",
            error: "Some error",
            stack: "Error stack",
        });
    });

    test("should handle PrismaClientKnownRequestError with code P2025", () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            "Record not found",
            "P2025",
            "1"
        );
        globalErrorHandler(error, req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Prisma Error",
            error: "Prisma Error: Record not found",
        });
    });

    test("should handle PrismaClientKnownRequestError with code P2003", () => {
        const error = new Prisma.PrismaClientKnownRequestError(
            "Foreign key constraint failed",
            "P2003",
            "1"
        );
        globalErrorHandler(error, req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Prisma Error",
            error: "Prisma Error: Foreign key constraint failed",
        });
    });

    test("should handle custom error", () => {
        const error = {
            statusCode: 400,
            message: "Custom error message",
        };
        globalErrorHandler(error, mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 400,
            message: "Custom error message",
            error: "Custom error message",
        });
    });

    test("should handle empty error object", () => {
        const error = {};
        globalErrorHandler(error, mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            statusCode: 500,
            message: "Internal Server Error",
            error: "Internal Server Error",
            stack: undefined,
        });
    });
});
// End of unit tests for: globalErrorHandler
