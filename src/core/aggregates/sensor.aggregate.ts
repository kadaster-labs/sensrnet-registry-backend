import { Aggregate } from '../../event-store/aggregate';
import { SensorState, SensorStateImpl } from './sensor-state';
import { EventMessage } from '../../event-store/event-message';
import { SensorUpdated, getSensorUpdatedEvent } from '../events/sensor/updated';
import { SensorDeleted, getSensorDeletedEvent } from '../events/sensor/deleted';
import { NoPermissionsException } from '../../command/handler/error/no-permissions-exception';
import { SensorRegistered, getSensorRegisteredEvent } from '../events/sensor/registered';

export class SensorAggregate extends Aggregate {

  state!: SensorState;

  constructor(
      private readonly aggregateId: string,
      ) {
    super();
  }

  validateLegalEntity(legalEntityId: string): void {
    if (!this.state.legalEntityIds.includes(legalEntityId)) {
      throw new NoPermissionsException(legalEntityId, this.aggregateId);
    }
  }

  register(legalEntityId: string, deviceId: string, name: string, description: string, location: number[],
           supplier: string, manufacturer: string, documentationUrl: string, active: boolean): void {
    this.simpleApply(new SensorRegistered(this.aggregateId, legalEntityId, deviceId, name, description,
        location, supplier, manufacturer, documentationUrl, active));
  }

  update(legalEntityId: string, name: string, description: string, supplier: string,
         manufacturer: string, documentationUrl: string, active: boolean): void {
    this.validateLegalEntity(legalEntityId);
    this.simpleApply(new SensorUpdated(this.aggregateId, legalEntityId, name, description, supplier,
        manufacturer, documentationUrl, active));
  }

  delete(legalEntityId: string): void {
    this.validateLegalEntity(legalEntityId);
    this.simpleApply(new SensorDeleted(this.aggregateId));
  }

  onSensorRegistered(eventMessage: EventMessage): void {
    const event = getSensorRegisteredEvent(eventMessage);

    const legalEntityIds = [event.legalEntityId];
    this.state = new SensorStateImpl(this.aggregateId, event.active, legalEntityIds);
  }

  onSensorUpdated(eventMessage: EventMessage): void {
    const event: SensorUpdated = getSensorUpdatedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onSensorDeleted(eventMessage: EventMessage): void {
    const event: SensorDeleted = getSensorDeletedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
