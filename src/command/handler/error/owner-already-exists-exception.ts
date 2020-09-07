import { DomainException } from '../../../core/errors/domain-exception';

export class OwnerAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(`Owner ${name} already exists.`);
  }
}
