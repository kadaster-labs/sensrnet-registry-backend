import { Aggregate } from '../../event-store/aggregate';
import { SensorActivated } from '../events/sensor/activated';
import { SensorState, SensorStateImpl } from './sensor-state';
import { EventMessage } from '../../event-store/event-message';
import { SensorDeactivated } from '../events/sensor/deactivated';
import { SensorUpdated, getSensorUpdatedEvent } from '../events/sensor/updated';
import { SensorDeleted, getSensorDeletedEvent } from '../events/sensor/deleted';
import { DatastreamAdded, getDatastreamAddedEvent } from '../events/sensor/ds-added';
import { SensorRelocated, getSensorRelocatedEvent } from '../events/sensor/relocated';
import { NotAnOwnerException } from '../../command/handler/error/not-an-owner-exception';
import { SensorRegistered, getSensorRegisteredEvent } from '../events/sensor/registered';
import { DatastreamUpdated, getDatastreamUpdatedEvent } from '../events/sensor/ds-updated';
import { DatastreamDeleted, getDatastreamDeletedEvent } from '../events/sensor/ds-deleted';
import { SensorActiveException } from '../../command/handler/error/sensor-active-exception';
import { CreateDatastreamBody } from '../../command/controller/model/create-datastream.body';
import { SensorInActiveException } from '../../command/handler/error/sensor-inactive-exception';
import { IsAlreadyOwnerException } from '../../command/handler/error/is-already-owner-exception';
import { SensorOwnershipShared, getSensorOwnershipSharedEvent } from '../events/sensor/ownership-shared';
import { SensorOwnershipTransferred, getSensorOwnershipTransferredEvent } from '../events/sensor/ownership-transferred';

export class SensorAggregate extends Aggregate {

  state!: SensorState;

  constructor(
      private readonly aggregateId: string,
      ) {
    super();
  }

  validateOrganization(organizationId: string): void {
    if (!this.state.organizationIds.includes(organizationId)) {
      throw new NotAnOwnerException(organizationId, this.aggregateId);
    }
  }

  register(organizationId: string, name: string, location: number[], baseObjectId: string,
           dataStreams: CreateDatastreamBody[], aim: string, description: string, manufacturer: string,
           active: boolean, observationArea: Record<string, any>, documentationUrl: string, theme: string[],
           category: string, typeName: string, typeDetails: Record<string, any>): void {
    this.simpleApply(new SensorRegistered(this.aggregateId, organizationId, name, location, baseObjectId,
        aim, description, manufacturer, active, observationArea, documentationUrl,
        theme, category, typeName, typeDetails));

    for (const dataStream of dataStreams) {
      this.addDatastream(organizationId, dataStream.dataStreamId, dataStream.name, dataStream.reason, dataStream.description,
          dataStream.observedProperty, dataStream.unitOfMeasurement, dataStream.isPublic, dataStream.isOpenData,
          dataStream.isReusable, dataStream.documentationUrl, dataStream.dataLink, dataStream.dataFrequency,
          dataStream.dataQuality);
    }
  }

  addDatastream(organizationId: string, dataStreamId: string, name: string, reason: string, description: string, observedProperty: string,
                unitOfMeasurement: string, isPublic: boolean, isOpenData: boolean, isReusable: boolean, documentationUrl: string,
                dataLink: string, dataFrequency: number, dataQuality: number): void {
    this.validateOrganization(organizationId);
    this.simpleApply(new DatastreamAdded(this.aggregateId, dataStreamId, name, reason, description, observedProperty,
        unitOfMeasurement, isPublic, isOpenData, isReusable, documentationUrl, dataLink, dataFrequency, dataQuality));
  }

  updateDataStream(organizationId: string, dataStreamId: string, name: string, reason: string, description: string, observedProperty: string,
                   unitOfMeasurement: string, isPublic: boolean, isOpenData: boolean, isReusable: boolean, documentationUrl: string,
                   dataLink: string, dataFrequency: number, dataQuality: number): void {
    this.validateOrganization(organizationId);
    this.simpleApply(new DatastreamUpdated(this.aggregateId, dataStreamId, name, reason, description, observedProperty,
        unitOfMeasurement, isPublic, isOpenData, isReusable, documentationUrl, dataLink, dataFrequency, dataQuality));
  }

  deleteDataStream(organizationId: string, dataStreamId: string): void {
    this.validateOrganization(organizationId);
    this.simpleApply(new DatastreamDeleted(this.aggregateId, dataStreamId));
  }

  update(organizationId: string, name: string, aim: string, description: string, manufacturer: string,
         observationArea: Record<string, any>, documentationUrl: string, theme: string[],
         category: string, typeName: string, typeDetails: Record<string, any>): void {
    this.validateOrganization(organizationId);
    this.simpleApply(new SensorUpdated(this.aggregateId, name, aim, description, manufacturer,
        observationArea, documentationUrl, theme, category, typeName, typeDetails));
  }

  transferOwnership(oldOrganizationId: string, newOrganizationId: string): void {
    this.validateOrganization(oldOrganizationId);
    if (this.state.organizationIds.includes(newOrganizationId)) {
      throw new IsAlreadyOwnerException(newOrganizationId);
    }

    this.simpleApply(new SensorOwnershipTransferred(this.aggregateId, oldOrganizationId, newOrganizationId));
  }

  shareOwnership(organizationId: string, newOrganizationId: string): void {
    this.validateOrganization(organizationId);
    if (this.state.organizationIds.includes(newOrganizationId)) {
      throw new IsAlreadyOwnerException(newOrganizationId);
    }

    this.simpleApply(new SensorOwnershipShared(this.aggregateId, newOrganizationId));
  }

  relocate(organizationId: string, location: number[], baseObjectId: string): void {
    this.validateOrganization(organizationId);
    this.simpleApply(new SensorRelocated(this.aggregateId, location, baseObjectId));
  }

  activate(organizationId: string): void {
    this.validateOrganization(organizationId);
    if (this.state.active) {
      throw new SensorActiveException(this.state.id);
    }

    this.simpleApply(new SensorActivated(this.aggregateId));
  }

  deactivate(organizationId: string): void {
    this.validateOrganization(organizationId);
    if (!this.state.active) {
      throw new SensorInActiveException(this.state.id);
    }

    this.simpleApply(new SensorDeactivated(this.aggregateId));
  }

  delete(organizationId: string): void {
    this.validateOrganization(organizationId);
    this.simpleApply(new SensorDeleted(this.aggregateId));
  }

  onSensorRegistered(eventMessage: EventMessage): void {
    const event = getSensorRegisteredEvent(eventMessage);

    const organizationIds = [event.organizationId];
    this.state = new SensorStateImpl(this.aggregateId, event.active, organizationIds);
  }

  onDatastreamAdded(eventMessage: EventMessage): void {
    const event: DatastreamAdded = getDatastreamAddedEvent(eventMessage);

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

  onSensorUpdated(eventMessage: EventMessage): void {
    const event: SensorUpdated = getSensorUpdatedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onSensorOwnershipTransferred(eventMessage: EventMessage): void {
    const event: SensorOwnershipTransferred = getSensorOwnershipTransferredEvent(eventMessage);

    this.state.organizationIds.push(event.newOrganizationId);
    const filterFn = (organizationId) => organizationId !== event.oldOrganizationId;
    this.state.organizationIds = this.state.organizationIds.filter(filterFn);
  }

  onSensorOwnershipShared(eventMessage: EventMessage): void {
    const event: SensorOwnershipShared = getSensorOwnershipSharedEvent(eventMessage);

    this.state.organizationIds.push(event.organizationId);
  }

  onSensorRelocated(eventMessage: EventMessage): void {
    const event: SensorRelocated = getSensorRelocatedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onSensorActivated(): void {
    this.state.active = true;
  }

  onSensorDeactivated(): void {
    this.state.active = false;
  }

  onSensorDeleted(eventMessage: EventMessage): void {
    const event: SensorDeleted = getSensorDeletedEvent(eventMessage);

    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
