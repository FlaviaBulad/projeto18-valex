import * as rechargeRepository from '../repositories/rechargeRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as cardService from './cardService.js';
import * as businessService from './businessService.js';
import * as balanceService from './balanceService.js';

async function validateBusiness(businessId: number, card) {
  const business = await businessService.getById(businessId);

  if (card.type !== business.type) {
    throw { type: 'badRequest' };
  }
}

async function checkCardBalance(id: number, amount: number) {
  const { balance } = await balanceService.calculateBalance(id);

  if (amount > balance) {
    throw { type: 'forbidden' };
  }
}

export async function payment(
  id: number,
  password: string,
  businessId: number,
  amount: number
) {
  const card = await cardService.checkIfCardExists(id);

  cardService.checkCardExpiration(card);

  if (!card.password) {
    throw { code: 'badRequest' };
  }

  if (card.isBlocked) {
    throw { code: 'badRequest' };
  }

  cardService.validatePassword(password, card.password);

  await validateBusiness(businessId, card);

  await checkCardBalance(id, amount);

  await paymentRepository.insert({ cardId: id, businessId, amount });
}
