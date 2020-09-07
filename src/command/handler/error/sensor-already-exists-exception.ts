import { DomainException } from '../../../core/errors/domain-exception';

export class SensorAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(`Sensor ${name} already exists.`);
  }
}
