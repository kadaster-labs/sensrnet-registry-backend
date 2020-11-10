import { SensorEvent } from './sensor.event';

export class SensorOwnershipTransferred extends SensorEvent {
  public readonly oldOrganizationId: string;
  public readonly newOrganizationId: string;

  constructor(sensorId: string, oldOrganizationId: string, newOrganizationId: string) {
    super(sensorId);
    this.oldOrganizationId = oldOrganizationId;
    this.newOrganizationId = newOrganizationId;
  }
}
