import { DomainException } from './domain-exception';

export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`User ${email} already exists.`);
  }
}
