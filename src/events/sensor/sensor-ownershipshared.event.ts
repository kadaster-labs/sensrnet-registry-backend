import {SensorEvent} from './sensor.event';

export class SensorOwnershipShared extends SensorEvent {
  public readonly ownerIds: string[];

  constructor(sensorId: string, ownerIds: string[]) {
    super(sensorId);
    this.ownerIds = ownerIds;
  }
}
