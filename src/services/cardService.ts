// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import * as companyRepository from '../repositories/companyRepository.js';
import * as employeeRepository from '../repositories/employeeRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';

dotenv.config();

export async function createCard(
  apiKey: string,
  employeeId: number,
  type: 'groceries' | 'restaurant' | 'transport' | 'education' | 'health'
) {
  const company = await companyRepository.findByApiKey(apiKey);

  if (!company) {
    throw { type: 'unauthorized' };
  }
  const employee = await employeeRepository.findById(employeeId);
  if (!employee) {
    throw { type: 'notFound' };
  }
  const cardExists = await cardRepository.findByTypeAndEmployeeId(
    type,
    employeeId
  );

  if (cardExists) {
    throw { type: 'conflict' };
  }

  const number: string = faker.finance.creditCardNumber(
    '63[7-9]#-####-####-###L'
  );

  const securityCode: string = faker.finance.creditCardCVV();

  const cryptrSecret: string = process.env.CRYPTR_SECRET;

  const cryptr = new Cryptr(cryptrSecret);

  const encryptedSecurityCode: string = cryptr.encrypt(securityCode);

  const [firstName, ...familyName]: string[] = employee.fullName.split(' ');
  const middleName = familyName.filter((name) => name.length >= 3);
  const lastName = middleName.pop();

  const cardholderName = `${firstName} ${middleName
    .map((name) => name[0])
    .join(' ')} ${lastName}`.toLocaleUpperCase();

  const expirationDate = dayjs().add(5, 'year').format('MM/YY');

  console.log(
    `${employeeId}, ${number}, ${cardholderName}, ${securityCode}, ${expirationDate}`
  );

  await cardRepository.insert({
    employeeId,
    number,
    cardholderName,
    securityCode: encryptedSecurityCode,
    expirationDate,
    isVirtual: false,
    isBlocked: false,
    type,
  });
}

export async function activateCard(id: number, cvc: string, password: string) {
  const card = await cardRepository.findById(id);
  if (!card) {
    throw { type: 'notFound' };
  }

  const now = dayjs().format('MM/YY');

  if (dayjs(now).isAfter(dayjs(card.expirationDate))) {
    throw { type: 'badRequest' };
  }

  const isAlreadyActivated = card.password;

  if (isAlreadyActivated) {
    throw { type: 'badRequest' };
  }

  const cryptrSecret: string = process.env.CRYPTR_SECRET;

  const cryptr = new Cryptr(cryptrSecret);

  const decryptedSecurityCode: string = cryptr.decrypt(card.securityCode);

  if (cvc !== decryptedSecurityCode) {
    throw { type: 'unauthorized' };
  }

  const SALT: number = Number(process.env.SALT);

  const passwordHash = bcrypt.hashSync(password, SALT);

  await cardRepository.update(id, { password: passwordHash });
}
