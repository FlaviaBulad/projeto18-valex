import joi from 'joi';

export const createCardSchema = joi.object({
  employeeId: joi.number().integer().required(),
  type: joi
    .string()
    .valid('groceries', 'restaurant', 'transport', 'education', 'health')
    .required(),
});

export const activateCardSchema = joi.object({});

export const rechargeCardSchema = joi.object({});
