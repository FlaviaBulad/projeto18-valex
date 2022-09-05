import { Request, Response } from 'express';

import * as balanceService from '../services/balanceService.js';

export async function balance(req: Request, res: Response) {
  const { id } = req.params;

  const balance = await balanceService.getBalanceAndTransactions(Number(id));

  res.sendStatus(200).send(balance); // ok
}
