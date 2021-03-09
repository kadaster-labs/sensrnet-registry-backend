import { Injectable } from '@nestjs/common';
import { EventStore } from '../../event-store/event-store';
import { DeviceAggregate } from '../aggregates/device.aggregate';
import { sensorDeviceEventType } from '../events/sensordevice/sensordevice-event-type';

@Injectable()
export class DeviceRepository {

  readonly streamRootValue: string;

  constructor(private readonly eventStore: EventStore) {
    this.streamRootValue = sensorDeviceEventType.streamRootValue;
  }

  async get(aggregateId: string): Promise<DeviceAggregate> {
    const exists = await this.eventStore.exists(`${this.streamRootValue}-${aggregateId}`);
    if (!exists) {
      return undefined;
    }

    const events = await this.eventStore.getEvents(`${this.streamRootValue}-${aggregateId}`);
    const aggregate = new DeviceAggregate(aggregateId);
    aggregate.loadFromHistory(events);

    return aggregate;
  }

}
