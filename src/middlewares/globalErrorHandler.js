import { Prisma } from "@prisma/client";
import {
    PrismaClientInitializationError,
    PrismaClientRustPanicError,
} from "@prisma/client/runtime/library";
import env from "../config/env.js";
import logger from "../config/logger.js";

/**
 * Global Error Handler Middleware
 * @type {import('express').RequestHandler}
 */
// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (error, req, res, next) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        let statusCode = 400;
        let errorDetail = "Something went wrong.";

        switch (error.code) {
            case "P2002":
                statusCode = 409;
                errorDetail = {
                    message: "Resource already exists.",
                    fields: error.meta?.target,
                };
                console.log(error);

                break;
            case "P2015":
                statusCode = 404;
                errorDetail = "Resource not found.";
                break;
            case "P2003":
                statusCode = 400;
                errorDetail = "Related resource does not exist.";
                break;
            case "P2025":
                statusCode = 404;
                errorDetail = "The requested record was not found.";
                break;
            case "P2011":
                statusCode = 400;
                errorDetail = "A required field is missing.";
                break;
            case "P2004":
                statusCode = 400;
                errorDetail = "Invalid data input.";
                break;
            default:
                errorDetail = `Prisma Error: ${error.message}`;
        }

        logger.error(error);
        res.status(statusCode).json({
            statusCode,
            message: "Prisma Error",
            error: errorDetail,
        });
        return;
    }

    // Handle database connection issues
    if (error instanceof PrismaClientInitializationError) {
        return res.status(500).json({
            statusCode: 500,
            message: "Database connection failed.",
            error: error.message,
        });
    }

    if (error instanceof PrismaClientRustPanicError) {
        return res.status(500).json({
            statusCode: 500,
            message: "Unexpected database error.",
            error: "Please contact support.",
        });
    }

    // Handle unauthorized errors
    if (error.name === "UnauthorizedError") {
        logger.error("Unauthorized access attempt");
        return res.status(401).json({
            statusCode: 401,
            message: "Unauthorized",
            error: "You do not have permission to perform this action.",
        });
    }

    // Default error handling
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    const isDev = env.NODE_ENV === "dev";
    logger.error(error);
    res.status(statusCode).json({
        statusCode,
        message,
        error: error.err || message,
        stack: isDev ? error.stack : undefined,
    });
};

export { globalErrorHandler };
