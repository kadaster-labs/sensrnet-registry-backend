import { DomainException } from './domain-exception';

export class SensorAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(`Owner ${name} already exists.`);
  }
}
