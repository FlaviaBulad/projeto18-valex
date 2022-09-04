import { Router } from 'express';

import * as cardController from '../controllers/cardController.js';
import validateSchema from '../middlewares/schemaValidator.js';
import { createCardSchema } from '../schemas/cardSchemas.js';

const cardRouter = Router();

cardRouter.post(
  '/cards',
  validateSchema(createCardSchema),
  cardController.createCard
);
cardRouter.post('/cards:id/activate'); // activate card by id
cardRouter.post('/cards:id/recharge'); // rechard card by id

export default cardRouter;
