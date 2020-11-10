import { DomainException } from '../../../core/errors/domain-exception';

export class IsAlreadyOwnerException extends DomainException {
  constructor(id: string) {
    super(`Organization ${id} owns this sensor already.`);
  }
}
