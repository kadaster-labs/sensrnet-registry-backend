import { DomainException } from '../../../core/errors/domain-exception';

export class SensorInActiveException extends DomainException {
  constructor(id: string) {
    super(`Sensor ${id} is already inactive.`);
  }
}
