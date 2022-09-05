import Cryptr from 'cryptr';
import * as employeeService from '../src/services/employeeService.js';

export function generateCardHolderName(employeeName: string) {
  const [firstName, ...familyName]: string[] = employeeName.split(' ');
  const middleName = familyName.filter((name) => name.length >= 3);
  const lastName = middleName.pop();

  const cardholderName = `${firstName} ${middleName
    .map((name) => name[0])
    .join(' ')} ${lastName}`.toLocaleUpperCase();

  return cardholderName;
}

export function cryptrConfig(): Cryptr {
  const cryptrSecret: string = process.env.CRYPTR_SECRET;
  const cryptr: Cryptr = new Cryptr(cryptrSecret);
  return cryptr;
}

export function encryptSecurityCode(securityCode: string) {
  const cryptr: Cryptr = cryptrConfig();
  const encryptedSecurityCode: string = cryptr.encrypt(securityCode);
  return encryptedSecurityCode;
}

export function decryptSecurityCode(encryptedSecurityCode: string) {
  const cryptr: Cryptr = cryptrConfig();
  const decryptedSecurityCode: string = cryptr.decrypt(encryptedSecurityCode);
  return decryptedSecurityCode;
}
