import { DomainException } from './domain-exception';

export class OwnerNotExistsException extends DomainException {
  constructor(id: string) {
    super(`Owner ${id} does not exist.`);
  }
}
