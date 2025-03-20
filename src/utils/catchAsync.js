/**
 *
 * @param {import('express').RequestHandler} fn
 * @returns {import('express').RequestHandler}
 */
const catchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};
export { catchAsync };
