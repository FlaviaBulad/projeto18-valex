import { Router } from 'express';

import * as cardController from '../controllers/cardController.js';
import validateSchema from '../middlewares/schemaValidator.js';
import {
  createCardSchema,
  activateCardSchema,
  rechargeCardSchema,
  paymentSchema,
  lockSchema,
} from '../schemas/cardSchemas.js';

const cardRouter = Router();

cardRouter.post(
  '/cards',
  validateSchema(createCardSchema),
  cardController.createCard
);

cardRouter.post(
  '/cards/:id/activate',
  validateSchema(activateCardSchema),
  cardController.activateCard
);

cardRouter.post(
  '/cards/:id/recharge',
  validateSchema(rechargeCardSchema),
  cardController.rechargeCard
);

cardRouter.post(
  '/cards/:id/lock',
  validateSchema(lockSchema),
  cardController.lockCard
);

cardRouter.post(
  '/cards/:id/unlock',
  validateSchema(lockSchema),
  cardController.unlockCard
);

cardRouter.get('/cards/:id/balance', cardController.balance);

cardRouter.post(
  '/cards/:id/payment/:businessId',
  validateSchema(paymentSchema),
  cardController.payment
);

export default cardRouter;
