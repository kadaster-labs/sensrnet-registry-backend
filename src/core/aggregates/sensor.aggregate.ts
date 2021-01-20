import { Aggregate } from '../../event-store/aggregate';
import { SensorState, SensorStateImpl } from './sensor-state';
import { EventMessage } from '../../event-store/event-message';
import { NotAnOwnerException } from '../../command/handler/error/not-an-owner-exception';
import { SensorActiveException } from '../../command/handler/error/sensor-active-exception';
import { CreateDatastreamBody } from '../../command/controller/model/create-datastream.body';
import { SensorInActiveException } from '../../command/handler/error/sensor-inactive-exception';
import { IsAlreadyOwnerException } from '../../command/handler/error/is-already-owner-exception';
import { DatastreamAdded, DatastreamUpdated, DatastreamDeleted, SensorActivated, SensorDeactivated, SensorDeleted,
  SensorOwnershipShared, SensorOwnershipTransferred, SensorRegistered, SensorRelocated, SensorUpdated } from '../events/sensor';

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
    this.simpleApply(new SensorRegistered(this.aggregateId, organizationId, name, location[0], location[1],
        location[2], baseObjectId, aim, description, manufacturer, active, observationArea, documentationUrl,
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
    this.simpleApply(new SensorRelocated(this.aggregateId, location[0], location[1], location[2], baseObjectId));
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
    const event: SensorRegistered = eventMessage.data as SensorRegistered;
    const organizationIds = [event.organizationId];
    this.state = new SensorStateImpl(this.aggregateId, event.active, organizationIds);
  }

  onDatastreamAdded(eventMessage: EventMessage): void {
    const event: DatastreamAdded = eventMessage.data as DatastreamAdded;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onDatastreamDeleted(eventMessage: EventMessage): void {
    const event: DatastreamDeleted = eventMessage.data as DatastreamDeleted;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onSensorUpdated(eventMessage: EventMessage): void {
    const event: SensorUpdated = eventMessage.data as SensorUpdated;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onSensorOwnershipTransferred(eventMessage: EventMessage): void {
    const event: SensorOwnershipTransferred = eventMessage.data as SensorOwnershipTransferred;
    this.state.organizationIds = this.state.organizationIds.filter((organizationId) => organizationId !== event.oldOrganizationId);
    this.state.organizationIds.push(event.newOrganizationId);
  }

  onSensorOwnershipShared(eventMessage: EventMessage): void {
    const event: SensorOwnershipShared = eventMessage.data as SensorOwnershipShared;
    this.state.organizationIds.push(event.organizationId);
  }

  onSensorRelocated(eventMessage: EventMessage): void {
    const event: SensorRelocated = eventMessage.data as SensorRelocated;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  onSensorActivated(): void {
    this.state.active = true;
  }

  onSensorDeactivated(): void {
    this.state.active = false;
  }

  onSensorDeleted(eventMessage: EventMessage): void {
    const event: SensorDeleted = eventMessage.data as SensorDeleted;
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
