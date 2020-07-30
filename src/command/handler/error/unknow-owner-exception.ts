import { DomainException } from '../../../core/errors/domain-exception';

export class UnknowOwnerException extends DomainException {
  constructor(id: string) {
    super(`Unknow owner ${id}.`);
  }
}
