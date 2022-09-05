import { Request, Response } from 'express';

import * as paymentService from '../services/paymentService.js';

export async function payment(req: Request, res: Response) {
  const { id, businessId } = req.params;
  const { password, amount } = req.body;

  await paymentService.payment(
    Number(id),
    password,
    Number(businessId),
    amount
  );

  res.sendStatus(201); // created
}
