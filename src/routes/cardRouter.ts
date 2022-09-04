import { Router } from 'express';

import * as cardController from '../controllers/cardController.js';
import validateSchema from '../middlewares/schemaValidator.js';
import {
  createCardSchema,
  activateCardSchema,
  rechargeCardSchema,
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

export default cardRouter;
