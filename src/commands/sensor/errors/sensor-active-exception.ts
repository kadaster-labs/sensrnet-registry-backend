import { DomainException } from "./domain-exception";


export class SensorActiveException extends DomainException {
  constructor(id: string) {
    super(`Sensor ${id} is already active.`);
  }
}

export class SensorInActiveException extends DomainException {
  constructor(id: string) {
    super(`Sensor ${id} is already inactive.`);
  }
}

