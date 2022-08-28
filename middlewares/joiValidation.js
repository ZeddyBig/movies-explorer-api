const { celebrate, Joi } = require('celebrate');

module.exports.signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

module.exports.movieIdValidation = celebrate({
  params: Joi.object({
    id: Joi.string().hex().length(24),
  }),
});

module.exports.moviePostValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/https?:\/\/w?w?w?.?\w+\W+(.\w+\W+)?(.\w+\W+)?(.\w+\W+)?(.\w+\W+)?(.\w+\W+)?/),
    trailerLink: Joi.string().required().pattern(/https?:\/\/w?w?w?.?\w+\W+(.\w+\W+)?(.\w+\W+)?(.\w+\W+)?(.\w+\W+)?(.\w+\W+)?/),
    thumbnail: Joi.string().required().pattern(/https?:\/\/w?w?w?.?\w+\W+(.\w+\W+)?(.\w+\W+)?(.\w+\W+)?(.\w+\W+)?(.\w+\W+)?/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});
