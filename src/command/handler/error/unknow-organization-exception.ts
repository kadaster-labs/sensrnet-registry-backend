import { DomainException } from '../../../core/errors/domain-exception';

export class UnknowOrganizationException extends DomainException {
  constructor(id: string) {
    super(`Unknow organization ${id}.`);
  }
}
