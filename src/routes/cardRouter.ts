import { Router } from 'express';

const cardRouter = Router();

cardRouter.post('/card'); // create card
cardRouter.post('/card:id/activate'); // activate card by id
cardRouter.post('/card:id/recharge'); // rechard card by id

export default cardRouter;
