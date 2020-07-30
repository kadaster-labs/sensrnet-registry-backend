import { DomainException } from '../../../core/errors/domain-exception';

export class NoRightsException extends DomainException {
  constructor(user) {
    super(`User ${user.userId} doesn't have the required role to perform this operation.`);
  }
}
