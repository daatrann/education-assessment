import Joi from "joi";
import dotenv from "dotenv";

const environment = process.env.NODE_ENV || "development";
dotenv.config({ path: `env/${environment}.env` });

const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid("development", "production", "test")
        .default("development"),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    // Add more environment variables here...
});

/**
 *
 * @returns {{NODE_ENV: string,PORT: number, DATABASE_URL:string
 * JWT_SECRET:string}}
 */
const createEnv = () => {
    console.log(process.env.DATABASE_URL);
    const { error, value: envVars } = envSchema.validate(process.env, {
        allowUnknown: true,
    });
    if (error) {
        throw new Error(
            `Invalid environment variables: ${error.details.map((d) => d.message).join(", ")}`
        );
    }
    return envVars;
};

export default createEnv();
