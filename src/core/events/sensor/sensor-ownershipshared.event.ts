import { SensorEvent } from './sensor.event';

export class SensorOwnershipShared extends SensorEvent {
  public readonly organizationId: string;

  constructor(sensorId: string, organizationId: string) {
    super(sensorId);
    this.organizationId = organizationId;
  }
}
