import { DomainException } from '../../../core/errors/domain-exception';

export class UnknowObjectException extends DomainException {
  constructor(id: string) {
    super(`Unknow object ${id}.`);
  }
}
