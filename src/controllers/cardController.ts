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
