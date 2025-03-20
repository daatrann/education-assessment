import Joi from "joi";

const userSchema = Joi.object({
    email: Joi.string()
        .email()
        .max(50)
        .alter({
            create: (schema) => schema.required(),
            update: (schema) => schema.optional(),
        }),
});

export const registerSchema = userSchema.tailor("create");
