/* eslint-disable camelcase */
import Joi from 'joi';

const JobPayloadSchema = Joi.object({
  company_id: Joi.string().required(),
  category_id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  job_type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship').required(),
  experience_level: Joi.string().valid('entry', 'junior', 'mid', 'senior', 'lead').required(),
  location_type: Joi.string().valid('onsite', 'remote', 'hybrid').required(),
  location_city: Joi.string().allow(null, '').optional(),
  salary_min: Joi.number().integer().min(0).allow(null).optional(),
  salary_max: Joi.number().integer().min(0).allow(null).optional(),
  is_salary_visible: Joi.boolean().default(true).optional(),
  status: Joi.string().valid('open', 'close', 'closed').default('open').optional(),
});

export default JobPayloadSchema;