import Joi from 'joi';

const companiesPayloadSchema = Joi.object({
  name: Joi.string().required().max(50),
  location: Joi.string().required(),
  description: Joi.string(),
});

export default companiesPayloadSchema;