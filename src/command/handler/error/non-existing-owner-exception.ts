import { DomainException } from '../../../core/errors/domain-exception';

export class NonExistingOwnerException extends DomainException {
  constructor(id: string) {
    super(`Owner ${id} does not exist.`);
  }
}
