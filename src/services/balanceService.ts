import * as rechargeRepository from '../repositories/rechargeRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as cardService from './cardService.js';

export function totalAmount(arr: any[]): number {
  if (!arr.length) {
    return 0;
  }

  return arr.reduce((prev, curr) => prev + curr.amount, 0);
}

export async function calculateBalance(id: number) {
  const payments = await paymentRepository.findByCardId(id);

  const recharges = await rechargeRepository.findByCardId(id);

  const totalPayments: number = totalAmount(payments);
  const totalRecharges: number = totalAmount(recharges);

  let balance = totalRecharges - totalPayments;

  if (balance < 0) balance = 0;

  return { balance, payments, recharges };
}

export async function getBalanceAndTransactions(id: number) {
  await cardService.checkIfCardExists(id);

  const balance: {
    balance: number;
    payments;
    recharges;
  } = await calculateBalance(id);

  return balance;
}
