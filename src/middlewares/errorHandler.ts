import { Request, Response } from 'express';

export default function handleError(error: any, req: Request, res: Response) {
  if (error.type === 'unauthorized') {
    return res.sendStatus(401);
  }
  if (error.type === 'forbidden') {
    return res.sendStatus(403);
  }
  if (error.type === 'notFound') {
    return res.sendStatus(404);
  }
  if (error.type === 'conflict') {
    return res.sendStatus(409);
  }
  if (error.type === 'unprocessableEntity') {
    return res.sendStatus(422);
  }
  return res.sendStatus(500);
}
