import { DomainException } from '../../../core/errors/domain-exception';

export class OrganizationAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(`Organization ${name} already exists.`);
  }
}
