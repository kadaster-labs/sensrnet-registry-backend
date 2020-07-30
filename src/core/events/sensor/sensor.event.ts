import { v4 as uuidv4 } from 'uuid';
import { Event } from '../../../event-store/event';

export const NODE_ID = process.env.NODE_ID || uuidv4();

export abstract class SensorEvent extends Event {

  readonly sensorId: string;
  readonly nodeId: string = NODE_ID;

  constructor(sensorId: string) {
    super(sensorId);
    this.sensorId = sensorId;
  }

  streamRoot(): string {
    return 'sensor';
  }
}
