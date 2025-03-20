// Unit tests for: catchAsync

import { catchAsync } from "../../utils/catchAsync";
import { jest } from "@jest/globals";

describe("catchAsync() catchAsync method", () => {
    // Happy Path Tests
    describe("Happy Paths", () => {
        it("should call the passed function with req, res, and next", async () => {
            // Arrange
            const mockFn = jest.fn().mockResolvedValue();
            const req = {};
            const res = {};
            const next = jest.fn();

            // Act
            const wrappedFunction = catchAsync(mockFn);
            await wrappedFunction(req, res, next);

            // Assert
            expect(mockFn).toHaveBeenCalledWith(req, res, next);
        });

        it("should not call next if the function resolves successfully", async () => {
            // Arrange
            const mockFn = jest.fn().mockResolvedValue();
            const req = {};
            const res = {};
            const next = jest.fn();

            // Act
            const wrappedFunction = catchAsync(mockFn);
            await wrappedFunction(req, res, next);

            // Assert
            expect(next).not.toHaveBeenCalled();
        });
    });

    // Edge Case Tests
    describe("Edge Cases", () => {
        it("should call next with an error if the function throws an error", async () => {
            // Arrange
            const error = new Error("Test error");
            const mockFn = jest.fn().mockRejectedValue(error);
            const req = {};
            const res = {};
            const next = jest.fn();

            // Act
            const wrappedFunction = catchAsync(mockFn);
            await wrappedFunction(req, res, next);

            // Assert
            expect(next).toHaveBeenCalledWith(error);
        });

        it("should handle functions that return non-promise values", async () => {
            // Arrange
            const mockFn = jest.fn().mockReturnValue("non-promise value");
            const req = {};
            const res = {};
            const next = jest.fn();

            // Act
            const wrappedFunction = catchAsync(mockFn);
            await wrappedFunction(req, res, next);

            // Assert
            expect(mockFn).toHaveBeenCalledWith(req, res, next);
            expect(next).not.toHaveBeenCalled();
        });

        it("should handle functions that do not return anything", async () => {
            // Arrange
            const mockFn = jest.fn();
            const req = {};
            const res = {};
            const next = jest.fn();

            // Act
            const wrappedFunction = catchAsync(mockFn);
            await wrappedFunction(req, res, next);

            // Assert
            expect(mockFn).toHaveBeenCalledWith(req, res, next);
            expect(next).not.toHaveBeenCalled();
        });
    });
});

// End of unit tests for: catchAsync
