import { DomainException } from '../../../core/errors/domain-exception';

export class UnknowSensorException extends DomainException {
  constructor(id: string) {
    super(`Unknow sensor ${id}.`);
  }
}
