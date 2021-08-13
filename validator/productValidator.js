 import Joi from 'joi';
 // validation
 const productSchema = Joi.object({
    name: Joi.string().required(),
    prize: Joi.number().required(),
    size: Joi.string().required(),
    image: Joi.string()
});

export default productSchema;