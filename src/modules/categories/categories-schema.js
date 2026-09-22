import Joi from 'joi';

const categoriesPayloadSchema = Joi.object({
  name: Joi.string().required().max(50),
});

export default categoriesPayloadSchema;