import { DomainException } from '../../../core/errors/domain-exception';

export class ObjectAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(`Object ${name} already exists.`);
  }
}
