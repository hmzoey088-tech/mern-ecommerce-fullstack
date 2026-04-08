import Joi from 'joi';

export const verifyEnv = () => {
  const schema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production').required(),
    PORT: Joi.number().default(4000),
    MONGODB_URI: Joi.string().uri().required(),
    ACCESS_TOKEN_SECRET: Joi.string().required(),
    REFRESH_TOKEN_SECRET: Joi.string().required(),
    EMAIL_SECRET: Joi.string().required(),
    CLIENT_ORIGIN: Joi.string().uri().required(),
    EMAIL_HOST: Joi.string().required(),
    EMAIL_PORT: Joi.number().required(),
    EMAIL_SECURE: Joi.string().valid('true', 'false').required(),
    EMAIL_USER: Joi.string().required(),
    EMAIL_PASS: Joi.string().required(),
    EMAIL_FROM: Joi.string().email().required(),
  }).unknown();

  const { error } = schema.validate(process.env);
  if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
  }
};
