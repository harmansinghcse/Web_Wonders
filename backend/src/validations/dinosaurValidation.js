const Joi = require("joi");

const dinosaurSchema = Joi.object({
    name: Joi.string().required(),

    diet: Joi.string().valid("Herbivore", "Carnivore", "Omnivore").required(),

    period: Joi.string().required(),

    height: Joi.number().positive(),

    weight: Joi.number().positive(),
});

module.exports = {
    dinosaurSchema,
};
