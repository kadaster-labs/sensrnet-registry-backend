import { Aggregate } from '../../event-store/aggregate';
import { DeviceState, DeviceStateImpl } from './device-state';
import { EventMessage } from '../../event-store/event-message';
import { DeviceRegistered, getDeviceRegisteredEvent } from '../events/device/registered';
import { DeviceUpdated, getDeviceUpdatedEvent } from '../events/device/updated';
import { DeviceDeleted, getDeviceDeletedEvent } from '../events/device/deleted';

export class DeviceAggregate extends Aggregate {

  state!: DeviceState;

  constructor(
      private readonly aggregateId: string,
      ) {
    super();
  }

  register(legalEntityId: string, description: string, connectivity: string, location: number[]): void {
    this.simpleApply(new DeviceRegistered(this.aggregateId, legalEntityId, description, connectivity, location));
  }

  update(legalEntityId: string, description: string, connectivity: string, location: number[]): void {
    this.simpleApply(new DeviceUpdated(this.aggregateId, legalEntityId, description, connectivity, location));
  }

  delete(): void {
    this.simpleApply(new DeviceDeleted(this.aggregateId));
  }

  onDeviceRegistered(eventMessage: EventMessage): void {
    const event: DeviceRegistered = getDeviceRegisteredEvent(eventMessage);

    this.state = new DeviceStateImpl(this.aggregateId, event.location);
  }

  onDeviceUpdated(eventMessage: EventMessage): void {
    const event: DeviceUpdated = getDeviceUpdatedEvent(eventMessage);
    if (event.location) {
      this.state.location = event.location;
    }
  }

  onDeviceDeleted(eventMessage: EventMessage): void {
    const event: DeviceDeleted = getDeviceDeletedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
