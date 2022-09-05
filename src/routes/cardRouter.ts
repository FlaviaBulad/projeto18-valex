import { Router } from 'express';

import * as cardController from '../controllers/cardController.js';
import * as rechargeController from '../controllers/rechargeController.js';
import * as balanceController from '../controllers/balanceController.js';
import * as paymentController from '../controllers/paymentController.js';

import validateSchema from '../middlewares/schemaValidator.js';
import {
  createCardSchema,
  activateCardSchema,
  lockSchema,
} from '../schemas/cardSchemas.js';

import { rechargeSchema } from '../schemas/rechargeSchema.js';
import { paymentSchema } from '../schemas/paymentSchema.js';

const cardRouter = Router();

cardRouter.post(
  '/cards',
  validateSchema(createCardSchema),
  cardController.createCard
);

cardRouter.put(
  '/cards/:id/activate',
  validateSchema(activateCardSchema),
  cardController.activateCard
);

cardRouter.post(
  '/cards/:id/recharge',
  validateSchema(rechargeSchema),
  rechargeController.rechargeCard
);

cardRouter.put(
  '/cards/:id/lock',
  validateSchema(lockSchema),
  cardController.lockCard
);

cardRouter.put(
  '/cards/:id/unlock',
  validateSchema(lockSchema),
  cardController.unlockCard
);

cardRouter.get('/cards/:id/balance', balanceController.balance);

cardRouter.post(
  '/cards/:id/payment/:businessId',
  validateSchema(paymentSchema),
  paymentController.payment
);

export default cardRouter;
