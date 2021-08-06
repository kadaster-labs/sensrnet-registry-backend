import { Injectable } from '@nestjs/common';
import { EventStore } from '../../commons/event-store/event-store';
import { sensorDeviceStreamRootValue } from '../../commons/events/sensordevice';
import { DeviceAggregate } from '../aggregates/device.aggregate';

@Injectable()
export class DeviceRepository {
    readonly streamRootValue: string;

    constructor(private readonly eventStore: EventStore) {
        this.streamRootValue = sensorDeviceStreamRootValue;
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
