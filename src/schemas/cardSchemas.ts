import joi from 'joi';

export const createCardSchema = joi.object({
  employeeId: joi.number().integer().required(),
  type: joi
    .string()
    .valid('groceries', 'restaurant', 'transport', 'education', 'health')
    .required(),
});

export const activateCardSchema = joi.object({
  cvc: joi.string().required(),
  password: joi.string().pattern(/^[0-9]{4}$/),
});

export const rechargeCardSchema = joi.object({
  amount: joi.number().min(1).required(),
});
