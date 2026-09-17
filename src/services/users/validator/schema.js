import Joi from 'joi';

export const userPayloadSchema = Joi.object({
  name: Joi.string().min(3).max(255),
  email: Joi.string().email().required(),
  role: Joi.string().valid('user', 'admin').required(),
  password: Joi.string().min(8).required(),
});