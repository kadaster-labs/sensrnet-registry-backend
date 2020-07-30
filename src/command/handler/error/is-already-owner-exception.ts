import { DomainException } from '../../../core/errors/domain-exception';

export class IsAlreadyOwnerException extends DomainException {
  constructor(id: string) {
    super(`Owner ${id} owns the sensor already.`);
  }
}
