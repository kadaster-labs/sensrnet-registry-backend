import { DomainException } from '../../../core/errors/domain-exception';

export class NonExistingOrganizationException extends DomainException {
  constructor(id: string) {
    super(`Organization ${id} does not exist.`);
  }
}
