export class AppResponse {
    /**
     * @param {import('express').Response} res
     * @param {StatusCodes} statusCode
     * @param {string} message
     * @param [data]
     */
    constructor(res, statusCode, message, data) {
        res.status(statusCode).json({
            statusCode,
            message,
            data: data,
        });
    }
}
