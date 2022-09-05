import joi from 'joi';

export const paymentSchema = joi.object({
  password: joi
    .string()
    .pattern(/^[0-9]{4}$/)
    .required(),
  amount: joi.number().min(1).required(),
});
