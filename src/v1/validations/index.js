import Joi from "joi";

export const QueryParamSchema = Joi.object()
    .keys({
        page: Joi.number().integer().positive().optional().default(1),
        limit: Joi.number().integer().positive().optional().default(20),
        sort: Joi.any().optional(),
        filter: Joi.any().optional(),
        search: Joi.string().optional(),
    })
    .unknown(true);
