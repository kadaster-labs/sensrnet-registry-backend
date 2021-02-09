import { SensorEvent } from '../sensor.event';

export class SensorOwnershipTransferred extends SensorEvent {
  static version = '1';

  public readonly oldOrganizationId: string;
  public readonly newOrganizationId: string;

  constructor(sensorId: string, oldOrganizationId: string, newOrganizationId: string) {
    super(sensorId, SensorOwnershipTransferred.version);
    this.oldOrganizationId = oldOrganizationId;
    this.newOrganizationId = newOrganizationId;
  }
}
