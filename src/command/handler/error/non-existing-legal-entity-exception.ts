import { DomainException } from '../../../core/errors/domain-exception';

export class NonExistingLegalEntityException extends DomainException {
  constructor(id: string) {
    super(`Legal Entity ${id} does not exist.`);
  }
}
