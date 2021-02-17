import { Aggregate } from '../../event-store/aggregate';
import { EventMessage } from '../../event-store/event-message';
import { DataStreamState, DataStreamStateImpl } from './data-stream-state';
import { DatastreamAdded, getDatastreamAddedEvent } from '../events/data-stream/added';
import { DatastreamUpdated, getDatastreamUpdatedEvent } from '../events/data-stream/updated';
import { DatastreamDeleted, getDatastreamDeletedEvent } from '../events/data-stream/deleted';
import { NoPermissionsException } from '../../command/handler/error/no-permissions-exception';
import { RegisterObservationBody } from '../../command/controller/model/observation/register-observation.body';

export class DataStreamAggregate extends Aggregate {

  state!: DataStreamState;

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

  register(legalEntityId: string, sensorId: string, name: string, description: string, unitOfMeasurement: string,
           isPublic: boolean, isOpenData: boolean, isReusable: boolean, containsPersonalInfoData: boolean,
           documentationUrl: string, dataLink: string, dataFrequency: number, dataQuality: number, theme: string[],
           observation: RegisterObservationBody): void {
    this.simpleApply(new DatastreamAdded(this.aggregateId, legalEntityId, sensorId, name, description, unitOfMeasurement,
        isPublic, isOpenData, isReusable, containsPersonalInfoData, documentationUrl, dataLink, dataFrequency,
        dataQuality, theme, observation));
  }

  update(legalEntityId: string, sensorId: string, name: string, description: string, unitOfMeasurement: string,
         isPublic: boolean, isOpenData: boolean, isReusable: boolean, containsPersonalInfoData: boolean,
         documentationUrl: string, dataLink: string, dataFrequency: number, dataQuality: number, theme: string[],
         observation: RegisterObservationBody): void {
    this.validateLegalEntity(legalEntityId);

    this.simpleApply(new DatastreamUpdated(this.aggregateId, sensorId, name, description, unitOfMeasurement,
        isPublic, isOpenData, isReusable, containsPersonalInfoData, documentationUrl, dataLink, dataFrequency,
        dataQuality, theme, observation));
  }

  delete(legalEntityId: string, sensorId: string): void {
    this.validateLegalEntity(legalEntityId);

    this.simpleApply(new DatastreamDeleted(this.aggregateId, sensorId));
  }

  onDatastreamAdded(eventMessage: EventMessage): void {
    const event: DatastreamAdded = getDatastreamAddedEvent(eventMessage);

    const legalEntityIds = [event.legalEntityId];
    this.state = new DataStreamStateImpl(this.aggregateId, legalEntityIds);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onDatastreamUpdated(eventMessage: EventMessage): void {
    const event: DatastreamUpdated = getDatastreamUpdatedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onDatastreamDeleted(eventMessage: EventMessage): void {
    const event: DatastreamDeleted = getDatastreamDeletedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
