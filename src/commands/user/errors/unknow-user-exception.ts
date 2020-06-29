import { DomainException } from './domain-exception';

export class UnknowUserException extends DomainException {
  constructor(email: string) {
    super(`Unknow user ${email}.`);
  }
}
