import * as businessRepository from '../repositories/businessRepository.js';

export async function getById(id: number) {
  const business = await businessRepository.findById(id);
  if (!business) {
    throw { type: 'notFound' };
  }
  return business;
}
