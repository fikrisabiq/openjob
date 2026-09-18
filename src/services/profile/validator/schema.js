/* eslint-disable camelcase */
const Joi = require('joi');

export const PostApplicationPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  status: Joi.string()
    .valid('pending', 'accepted', 'rejected')
    .default('pending')
    .optional(),
});

export const PutApplicationStatusPayloadSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'accepted', 'rejected')
    .required(),
});