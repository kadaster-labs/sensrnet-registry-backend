import { DomainException } from '../../../core/errors/domain-exception';

export class SensorActiveException extends DomainException {
  constructor(id: string) {
    super(`Sensor ${id} is already active.`);
  }
}
