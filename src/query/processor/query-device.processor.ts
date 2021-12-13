import { Injectable } from '@nestjs/common';
import { CheckpointService } from '../../commons/event-processing/checkpoint/checkpoint.service';
import { DeviceProcessor } from '../../commons/event-processing/device.processor';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import {
    DatastreamAdded,
    DatastreamRemoved,
    DatastreamUpdated,
    DeviceLocated,
    DeviceRegistered,
    DeviceRelocated,
    DeviceRemoved,
    DeviceUpdated,
    ObservationGoalLinked,
    ObservationGoalUnlinked,
    SensorAdded,
    sensorDeviceStreamRootValue,
    SensorRemoved,
    SensorUpdated,
} from '../../commons/events/sensordevice';
import { SensorDeviceEvent } from '../../commons/events/sensordevice/sensordevice.event';
import { Gateway } from '../gateway/gateway';
import { IDevice } from '../model/device.schema';
import { DeviceEsListener } from './device.es.listener';

@Injectable()
export class QueryDeviceProcessor extends DeviceProcessor {
    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        private readonly gateway: Gateway,
        private readonly deviceListener: DeviceEsListener,
    ) {
        super(`backend-${sensorDeviceStreamRootValue}-es`, eventStore, checkpointService);
    }

    async process(event: SensorDeviceEvent): Promise<void> {
        let device: IDevice;
        let legalEntityIds: string[];

        if (event instanceof DeviceRegistered) {
            device = await this.deviceListener.processDeviceRegistered(event);
            legalEntityIds = await this.deviceListener.getDeviceLegalEntityIds(event);
        } else if (event instanceof DeviceUpdated) {
            device = await this.deviceListener.processDeviceUpdated(event);
            legalEntityIds = await this.deviceListener.getDeviceLegalEntityIds(event);
        } else if (event instanceof DeviceRemoved) {
            legalEntityIds = await this.deviceListener.getDeviceLegalEntityIds(event);
            device = await this.deviceListener.processDeviceDeleted(event);
        } else if (event instanceof DeviceLocated) {
            device = await this.deviceListener.processDeviceLocated(event);
            legalEntityIds = await this.deviceListener.getDeviceLegalEntityIds(event);
        } else if (event instanceof DeviceRelocated) {
            device = await this.deviceListener.processDeviceRelocated(event);
            legalEntityIds = await this.deviceListener.getDeviceLegalEntityIds(event);
        } else if (event instanceof SensorAdded) {
            await this.deviceListener.processSensorAdded(event);
        } else if (event instanceof SensorUpdated) {
            await this.deviceListener.processSensorUpdated(event);
        } else if (event instanceof SensorRemoved) {
            await this.deviceListener.processSensorRemoved(event);
        } else if (event instanceof DatastreamAdded) {
            device = await this.deviceListener.processDatastreamAdded(event);
            legalEntityIds = await this.deviceListener.getDeviceLegalEntityIds(event);
        } else if (event instanceof DatastreamUpdated) {
            device = await this.deviceListener.processDatastreamUpdated(event);
            legalEntityIds = await this.deviceListener.getDeviceLegalEntityIds(event);
        } else if (event instanceof DatastreamRemoved) {
            device = await this.deviceListener.processDatastreamRemoved(event);
            legalEntityIds = await this.deviceListener.getDeviceLegalEntityIds(event);
        } else if (event instanceof ObservationGoalLinked) {
            await this.deviceListener.processObservationGoalLinked(event);
        } else if (event instanceof ObservationGoalUnlinked) {
            await this.deviceListener.processObservationGoalUnlinked(event);
        }

        if (device && legalEntityIds) {
            this.gateway.emit(event.constructor.name, legalEntityIds, { canEdit: true, ...device.toObject() });
        }
    }
}
