import { Request, Response } from 'express';
import * as cardService from '../services/cardService.js';

export async function createCard(req: Request, res: Response) {
  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey) {
    throw { type: 'unauthorized' };
  }

  const { employeeId, type } = req.body;

  await cardService.createCard(apiKey, employeeId, type);

  res.sendStatus(201); // created
}

export async function activateCard(req: Request, res: Response) {
  const { id } = req.params;

  const { cvc, password } = req.body;

  await cardService.activateCard(Number(id), cvc, password);

  res.sendStatus(200); // ok
}

export async function rechargeCard(req: Request, res: Response) {
  const { id } = req.params;
  const { amount } = req.body;

  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey) {
    throw { type: 'unauthorized' };
  }
  await cardService.rechargeCard(apiKey, Number(id), amount);

  res.sendStatus(200);
}

export async function payment(req: Request, res: Response) {
  const { id, businessId } = req.params;
  const { password, amount } = req.body;

  await cardService.payment(Number(id), password, Number(businessId), amount);

  res.sendStatus(201); // created
}

export async function lockCard(req: Request, res: Response) {
  const { id } = req.params;
  const { password } = req.body;

  await cardService.lockCard(Number(id), password);

  res.sendStatus(200); // ok
}

export async function unlockCard(req: Request, res: Response) {
  const { id } = req.params;
  const { password } = req.body;

  await cardService.unlockCard(Number(id), password);

  res.sendStatus(200); // ok
}

export async function balance(req: Request, res: Response) {
  const { id } = req.params;

  await cardService.balance(Number(id));

  res.sendStatus(200); // ok
}
