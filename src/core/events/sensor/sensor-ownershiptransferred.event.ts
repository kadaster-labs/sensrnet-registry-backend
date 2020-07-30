import {SensorEvent} from './sensor.event';

export class SensorOwnershipTransferred extends SensorEvent {

  public readonly oldOwnerId: string;
  public readonly newOwnerId: string;

  constructor(sensorId: string, oldOwnerId: string, newOwnerId: string) {
    super(sensorId);
    this.oldOwnerId = oldOwnerId;
    this.newOwnerId = newOwnerId;
  }
}
