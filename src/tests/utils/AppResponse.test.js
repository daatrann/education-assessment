import { AppResponse } from "../../utils/AppResponse.js";
import { jest } from "@jest/globals";

describe("AppResponse Class", () => {
    let mockRes;

    beforeEach(() => {
        // Mock Express response object
        mockRes = {
            status: jest.fn().mockReturnThis(), // Allows method chaining
            json: jest.fn(),
        };
    });

    it("should set the status and send a JSON response correctly", () => {
        // Arrange
        const statusCode = 200;
        const message = "Success";
        const data = { id: 1, name: "Test Data" };

        // Act
        new AppResponse(mockRes, statusCode, message, data);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(statusCode);
        expect(mockRes.json).toHaveBeenCalledWith({
            statusCode,
            message,
            data,
        });
    });

    it("should handle cases where no data is provided", () => {
        // Arrange
        const statusCode = 400;
        const message = "Bad Request";

        // Act
        new AppResponse(mockRes, statusCode, message);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(statusCode);
        expect(mockRes.json).toHaveBeenCalledWith({
            statusCode,
            message,
            data: undefined, // Should be explicitly undefined
        });
    });
});
