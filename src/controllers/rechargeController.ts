import { Request, Response } from 'express';

import * as rechargeService from '../services/rechargeService.js';

export async function rechargeCard(req: Request, res: Response) {
  const { id } = req.params;
  const { amount } = req.body;

  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey) {
    throw { type: 'unauthorized' };
  }
  await rechargeService.rechargeCard(apiKey, Number(id), amount);

  res.sendStatus(201); // created
}
