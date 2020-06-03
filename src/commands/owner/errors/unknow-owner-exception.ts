import { DomainException } from './domain-exception';

export class UnknowOwnerException extends DomainException {
  constructor(id: string) {
    super(`Unknow owner ${id}.`);
  }
}
