import * as cardService from '../services/cardService.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';
import * as companyService from './companyService.js';

export async function rechargeCard(apiKey: string, id: number, amount: number) {
  await companyService.validateApiKey(apiKey);

  const card = await cardService.checkIfCardExists(id);

  cardService.checkCardExpiration(card);

  if (!card.password || card.isBlocked) {
    throw { code: 'badRequest' };
  }

  await rechargeRepository.insert({ cardId: id, amount });
}
