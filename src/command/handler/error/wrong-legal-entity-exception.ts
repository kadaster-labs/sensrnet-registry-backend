import { DomainException } from '../../../commons/errors/domain-exception';

export class WrongLegalEntityException extends DomainException {
  constructor() {
    super(`Wrong organization with the current user.`);
  }
}
