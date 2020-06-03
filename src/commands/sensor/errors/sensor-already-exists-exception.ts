import { DomainException } from './domain-exception';

export class SensorAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(`Sensor ${name} already exists.`);
  }
}
