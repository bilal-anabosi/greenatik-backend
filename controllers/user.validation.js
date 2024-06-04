const joi = require('joi');

const signupschema = {
  body: joi.object({
    username: joi.string().alphanum().min(3).max(20).required(),
    email: joi.string().required(),
    password: joi.string().min(8).max(20).required(),
    role: joi.string().valid('user', 'admin','delivery').required(),
    address:joi.string().required()
  })
};

const signinschema = {
  body: joi.object({
    email: joi.string().required(),
    password: joi.string().min(8).max(20).required()
  })
};

module.exports = { signupschema, signinschema };
