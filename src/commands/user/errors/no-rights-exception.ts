import { DomainException } from './domain-exception';

export class NoRightsException extends DomainException {
  constructor(user) {
    super(`User ${user.userId} doesn't have enough rights to perform this operation.`);
  }
}
