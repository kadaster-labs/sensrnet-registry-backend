import { SensorEvent } from '../../sensor.event';

export class SensorOwnershipShared extends SensorEvent {
  static version = '1.0.0';

  public readonly organizationId: string;

  constructor(sensorId: string, organizationId: string) {
    super(sensorId, SensorOwnershipShared.version);
    this.organizationId = organizationId;
  }
}
