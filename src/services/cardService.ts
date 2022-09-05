// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import * as cardRepository from '../repositories/cardRepository.js';
import * as cardUtils from '../../utils/cardUtils.js';
import * as companyService from './companyService.js';
import * as employeeService from './employeeService.js';

dotenv.config();

export async function getEmployeeCards(
  type: cardRepository.TransactionTypes,
  employeeId: number
) {
  const cardTypeExists = await cardRepository.findByTypeAndEmployeeId(
    type,
    employeeId
  );
  if (cardTypeExists) {
    throw { type: 'conflict' };
  }
  return cardTypeExists;
} // checks if employee already has a card with this type

function generateCardData(employeeName: string) {
  const number: string = faker.finance.creditCardNumber(
    '63[7-9]#-####-####-###L'
  );

  const expirationDate = dayjs().add(5, 'year').format('MM/YY');

  const cardholderName = cardUtils.generateCardHolderName(employeeName);

  const securityCode: string = faker.finance.creditCardCVV();
  console.log(` ${cardholderName} ${number} ${securityCode} ${expirationDate}`);

  const encryptedSecurityCode: string =
    cardUtils.encryptSecurityCode(securityCode);

  return {
    number,
    cardholderName,
    securityCode: encryptedSecurityCode,
    expirationDate,
  };
}

export async function createCard(
  apiKey: string,
  employeeId: number,
  type: cardRepository.TransactionTypes
) {
  await companyService.validateApiKey(apiKey);

  const employee = await employeeService.getById(employeeId);

  await getEmployeeCards(type, employeeId);

  const cardData = generateCardData(employee.fullName);

  await cardRepository.insert({
    ...cardData,
    employeeId,
    isVirtual: false,
    isBlocked: false,
    type,
  });
}

export async function checkIfCardExists(id: number) {
  const card = await cardRepository.findById(id);

  if (!card) {
    throw { type: 'NotFound' };
  }

  return card;
}

export async function checkCardExpiration(card) {
  const now = dayjs().format('MM/YY');

  if (dayjs(now).isAfter(dayjs(card.expirationDate))) {
    throw { type: 'badRequest' };
  }
}

export function validatePassword(password: string, passwordHash: string) {
  if (!bcrypt.compareSync(password, passwordHash)) {
    throw { type: 'unauthorized' };
  }
}

export async function activateCard(id: number, cvc: string, password: string) {
  const card = await checkIfCardExists(id);

  checkCardExpiration(card);

  const isAlreadyActivated = card.password;

  if (isAlreadyActivated) {
    throw { type: 'badRequest' };
  }

  const decryptedSecurityCode: string = cardUtils.decryptSecurityCode(
    card.securityCode
  );

  if (cvc !== decryptedSecurityCode) {
    throw { type: 'unauthorized' };
  }

  const SALT: number = Number(process.env.SALT);

  const passwordHash = bcrypt.hashSync(password, SALT);

  const cardUpdated: cardRepository.CardUpdateData = {
    password: passwordHash,
    originalCardId: id,
    isBlocked: false,
  };

  await cardRepository.update(id, cardUpdated);
}

export async function lockCard(id: number, password: string) {
  const card = await checkIfCardExists(id);

  checkCardExpiration(card);

  validatePassword(password, card.password);

  if (card.isBlocked) {
    throw { type: 'conflict' };
  }

  const cardUpdated: cardRepository.CardUpdateData = {
    isBlocked: true,
  };

  await cardRepository.update(id, cardUpdated);
}

export async function unlockCard(id: number, password: string) {
  const card = await checkIfCardExists(id);

  checkCardExpiration(card);

  validatePassword(password, card.password);

  if (!card.isBlocked) {
    throw { type: 'conflict' };
  }

  const cardUpdated: cardRepository.CardUpdateData = {
    isBlocked: true,
  };

  await cardRepository.update(id, cardUpdated);
}
