import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import {
    DatastreamAdded,
    DatastreamRemoved,
    DatastreamUpdated,
    ObservationGoalLinked,
    ObservationGoalUnlinked,
} from '../../commons/events/sensordevice/datastream';
import {
    DeviceLocated,
    DeviceRegistered,
    DeviceRelocated,
    DeviceRemoved,
    DeviceUpdated,
} from '../../commons/events/sensordevice/device';
import { SensorAdded, SensorRemoved, SensorUpdated } from '../../commons/events/sensordevice/sensor';
import { SensorDeviceEvent } from '../../commons/events/sensordevice/sensordevice.event';
import { Gateway } from '../gateway/gateway';
import { IDevice } from '../model/device.schema';
import { IObservationGoal } from '../model/observation-goal.schema';
import { IRelation, RelationVariant, TargetVariant } from '../model/relation.schema';
import { AbstractQueryProcessor } from './abstract-query.processor';
import { DeviceEsListener } from './device.es.listener';

@Injectable()
export class DeviceProcessor extends AbstractQueryProcessor {
    constructor(
        eventStore: EventStorePublisher,
        private readonly gateway: Gateway,
        protected readonly listener: DeviceEsListener,
        @InjectModel('Device') private deviceModel: Model<IDevice>,
        @InjectModel('Relation') public relationModel: Model<IRelation>,
        @InjectModel('ObservationGoal') private observationGoalModel: Model<IObservationGoal>,
    ) {
        super(listener, eventStore, relationModel);
    }

    async process(event: SensorDeviceEvent): Promise<void> {
        let device: IDevice;
        let legalEntityIds: string[];

        if (event instanceof DeviceRegistered) {
            device = await this.processDeviceRegistered(event);
            legalEntityIds = await this.getDeviceLegalEntityIds(event);
        } else if (event instanceof DeviceUpdated) {
            device = await this.processDeviceUpdated(event);
            legalEntityIds = await this.getDeviceLegalEntityIds(event);
        } else if (event instanceof DeviceRemoved) {
            legalEntityIds = await this.getDeviceLegalEntityIds(event);
            device = await this.processDeviceDeleted(event);
        } else if (event instanceof DeviceLocated) {
            device = await this.processDeviceLocated(event);
            legalEntityIds = await this.getDeviceLegalEntityIds(event);
        } else if (event instanceof DeviceRelocated) {
            device = await this.processDeviceRelocated(event);
            legalEntityIds = await this.getDeviceLegalEntityIds(event);
        } else if (event instanceof SensorAdded) {
            await this.processSensorAdded(event);
        } else if (event instanceof SensorUpdated) {
            await this.processSensorUpdated(event);
        } else if (event instanceof SensorRemoved) {
            await this.processSensorRemoved(event);
        } else if (event instanceof DatastreamAdded) {
            await this.processDatastreamAdded(event);
        } else if (event instanceof DatastreamUpdated) {
            await this.processDatastreamUpdated(event);
        } else if (event instanceof DatastreamRemoved) {
            await this.processDatastreamRemoved(event);
        } else if (event instanceof ObservationGoalLinked) {
            await this.processObservationGoalLinked(event);
        } else if (event instanceof ObservationGoalUnlinked) {
            await this.processObservationGoalUnlinked(event);
        }

        if (device && legalEntityIds) {
            this.gateway.emit(event.constructor.name, legalEntityIds, { canEdit: true, ...device.toObject() });
        }
    }

    async getDeviceLegalEntityIds(eventRecord: Record<string, any>): Promise<string[]> {
        const relationFilter = { targetVariant: TargetVariant.DEVICE, targetId: eventRecord.deviceId };
        const relationResult = { _id: 0, legalEntityId: 1 };
        const legalEntityIds = await this.relationModel.find(relationFilter, relationResult);

        return legalEntityIds.map(x => x.legalEntityId);
    }

    async processDeviceRegistered(event: DeviceRegistered): Promise<IDevice> {
        const deviceData: Record<string, any> = {
            _id: event.deviceId,
            name: event.name,
            description: event.description,
            category: event.category,
            connectivity: event.connectivity,
        };

        let device;
        try {
            device = await new this.deviceModel(deviceData).save();
            await this.saveRelation(
                event.legalEntityId,
                RelationVariant.RESPONSIBLE,
                TargetVariant.DEVICE,
                event.deviceId,
            );
        } catch {
            this.errorCallback(event);
        }

        return device as IDevice;
    }

    async processDeviceUpdated(event: DeviceUpdated): Promise<IDevice> {
        const deviceUpdate: Record<string, any> = {};

        if (AbstractQueryProcessor.defined(event.name)) {
            deviceUpdate.name = event.name;
        }
        if (AbstractQueryProcessor.defined(event.description)) {
            deviceUpdate.description = event.description;
        }
        if (AbstractQueryProcessor.defined(event.category)) {
            deviceUpdate.category = event.category;
        }
        if (AbstractQueryProcessor.defined(event.connectivity)) {
            deviceUpdate.connectivity = event.connectivity;
        }

        let device;
        try {
            device = await this.deviceModel.findOneAndUpdate(
                { _id: event.deviceId },
                { $set: deviceUpdate },
                { new: true },
            );
        } catch {
            this.errorCallback(event);
        }

        return device;
    }

    async processDeviceLocated(event: DeviceLocated): Promise<IDevice> {
        const deviceUpdate: Record<string, any> = {};

        const locationDetails: Record<string, any> = {};
        if (AbstractQueryProcessor.defined(event.name)) {
            locationDetails.name = event.name;
        }
        if (AbstractQueryProcessor.defined(event.description)) {
            locationDetails.description = event.description;
        }
        if (Object.keys(locationDetails).length) {
            deviceUpdate.locationDetails = locationDetails;
        }
        if (AbstractQueryProcessor.defined(event.location)) {
            deviceUpdate.location = {
                type: 'Point',
                coordinates: event.location,
            };
        }

        let device;
        try {
            device = await this.deviceModel.findOneAndUpdate(
                { _id: event.deviceId },
                { $set: deviceUpdate },
                { new: true },
            );
        } catch {
            this.errorCallback(event);
        }

        return device;
    }

    async processDeviceRelocated(event: DeviceRelocated): Promise<IDevice> {
        return this.processDeviceLocated(event);
    }

    async processDeviceDeleted(event: DeviceRemoved): Promise<IDevice> {
        let device;

        try {
            await this.deleteRelations(event.legalEntityId, TargetVariant.DEVICE, event.deviceId);

            device = await this.deviceModel.findOneAndDelete({ _id: event.deviceId });
            await this.eventStore.deleteStream(
                SensorDeviceEvent.getStreamName(SensorDeviceEvent.streamRootValue, event.deviceId),
            );
        } catch {
            this.errorCallback(event);
        }

        return device;
    }

    async processSensorAdded(event: SensorAdded): Promise<void> {
        const sensorData = {
            _id: event.sensorId,
            name: event.name,
            description: event.description,
            type: event.type,
            manufacturer: event.manufacturer,
            supplier: event.supplier,
            documentation: event.documentation,
        };

        const sensorFilter = {
            _id: event.deviceId,
            'sensors._id': { $ne: event.sensorId },
        };

        try {
            await this.deviceModel.updateOne(sensorFilter, { $push: { sensors: sensorData } });
        } catch {
            this.errorCallback(event);
        }
    }

    async processSensorUpdated(event: SensorUpdated): Promise<void> {
        const sensorFilter = {
            _id: event.deviceId,
            'sensors._id': event.sensorId,
        };

        const sensorUpdate: Record<string, any> = {};
        if (AbstractQueryProcessor.defined(event.name)) {
            sensorUpdate['sensors.$.name'] = event.name;
        }
        if (AbstractQueryProcessor.defined(event.description)) {
            sensorUpdate['sensors.$.description'] = event.description;
        }
        if (AbstractQueryProcessor.defined(event.type)) {
            sensorUpdate['sensors.$.type'] = event.type;
        }
        if (AbstractQueryProcessor.defined(event.manufacturer)) {
            sensorUpdate['sensors.$.manufacturer'] = event.manufacturer;
        }
        if (AbstractQueryProcessor.defined(event.supplier)) {
            sensorUpdate['sensors.$.supplier'] = event.supplier;
        }
        if (AbstractQueryProcessor.defined(event.documentation)) {
            sensorUpdate['sensors.$.documentation'] = event.documentation;
        }

        try {
            await this.deviceModel.updateOne(sensorFilter, { $set: sensorUpdate });
        } catch {
            this.errorCallback(event);
        }
    }

    async processSensorRemoved(event: SensorRemoved): Promise<void> {
        const sensorDelete = {
            $pull: {
                sensors: { _id: event.sensorId },
                datastreams: { sensorId: event.sensorId },
            },
        };
        await this.deviceModel.updateOne({ _id: event.deviceId }, sensorDelete);
    }

    async processDatastreamAdded(event: DatastreamAdded): Promise<void> {
        const datastreamData = {
            _id: event.datastreamId,
            sensorId: event.sensorId,
            name: event.name,
            description: event.description,
            unitOfMeasurement: event.unitOfMeasurement,
            observationArea: event.observationArea,
            theme: event.theme,
            dataQuality: event.dataQuality,
            isActive: !!event.isActive,
            isPublic: !!event.isPublic,
            isOpenData: !!event.isOpenData,
            containsPersonalInfoData: !!event.containsPersonalInfoData,
            isReusable: !!event.isReusable,
            documentation: event.documentation,
            dataLink: event.dataLink,
        };

        const datastreamFilter = {
            _id: event.deviceId,
            'datastreams._id': { $ne: event.datastreamId },
        };

        try {
            await this.deviceModel.updateOne(datastreamFilter, { $push: { datastreams: datastreamData } });
        } catch {
            this.errorCallback(event);
        }
    }

    async processDatastreamUpdated(event: DatastreamUpdated): Promise<void> {
        const datastreamFilter = {
            _id: event.deviceId,
            'datastreams._id': event.datastreamId,
        };

        const datastreamUpdate: Record<string, any> = {};
        if (AbstractQueryProcessor.defined(event.name)) {
            datastreamUpdate['datastreams.$.name'] = event.name;
        }
        if (AbstractQueryProcessor.defined(event.description)) {
            datastreamUpdate['datastreams.$.description'] = event.description;
        }
        if (AbstractQueryProcessor.defined(event.unitOfMeasurement)) {
            datastreamUpdate['datastreams.$.unitOfMeasurement'] = event.unitOfMeasurement;
        }
        if (AbstractQueryProcessor.defined(event.observationArea)) {
            datastreamUpdate['datastreams.$.observationArea'] = event.observationArea;
        }
        if (AbstractQueryProcessor.defined(event.theme)) {
            datastreamUpdate['datastreams.$.theme'] = event.theme;
        }
        if (AbstractQueryProcessor.defined(event.dataQuality)) {
            datastreamUpdate['datastreams.$.dataQuality'] = event.dataQuality;
        }
        if (AbstractQueryProcessor.defined(event.isActive)) {
            datastreamUpdate['datastreams.$.isActive'] = !!event.isActive;
        }
        if (AbstractQueryProcessor.defined(event.isPublic)) {
            datastreamUpdate['datastreams.$.isPublic'] = !!event.isPublic;
        }
        if (AbstractQueryProcessor.defined(event.isOpenData)) {
            datastreamUpdate['datastreams.$.isOpenData'] = !!event.isOpenData;
        }
        if (AbstractQueryProcessor.defined(event.containsPersonalInfoData)) {
            datastreamUpdate['datastreams.$.containsPersonalInfoData'] = !!event.containsPersonalInfoData;
        }
        if (AbstractQueryProcessor.defined(event.isReusable)) {
            datastreamUpdate['datastreams.$.isReusable'] = !!event.isReusable;
        }
        if (AbstractQueryProcessor.defined(event.documentation)) {
            datastreamUpdate['datastreams.$.documentation'] = event.documentation;
        }
        if (AbstractQueryProcessor.defined(event.dataLink)) {
            datastreamUpdate['datastreams.$.dataLink'] = event.dataLink;
        }

        try {
            await this.deviceModel.updateOne(datastreamFilter, { $set: datastreamUpdate });
        } catch {
            this.errorCallback(event);
        }
    }

    async processDatastreamRemoved(event: DatastreamRemoved): Promise<void> {
        const datastreamFilter = { _id: event.deviceId };
        const datastreamRemove = { $pull: { datastreams: { _id: event.datastreamId } } };
        try {
            await this.deviceModel.updateOne(datastreamFilter, datastreamRemove);
        } catch {
            this.errorCallback(event);
        }
    }

    async processObservationGoalLinked(event: ObservationGoalLinked): Promise<void> {
        const datastreamFilter = {
            _id: event.deviceId,
            'datastreams._id': event.datastreamId,
            'datastreams.observationGoalIds': { $ne: event.observationGoalId },
        };

        const datastreamUpdate = {
            $push: {
                'datastreams.$.observationGoalIds': event.observationGoalId,
            },
        };

        try {
            await this.deviceModel.updateOne(datastreamFilter, datastreamUpdate);
        } catch {
            this.errorCallback(event);
        }
    }

    async processObservationGoalUnlinked(event: ObservationGoalUnlinked): Promise<void> {
        const datastreamFilter = {
            _id: event.deviceId,
            'datastreams._id': event.datastreamId,
        };

        const datastreamUpdate = {
            $pull: {
                'datastreams.$.observationGoalIds': event.observationGoalId,
            },
        };

        try {
            await this.deviceModel.updateOne(datastreamFilter, datastreamUpdate);
        } catch {
            this.errorCallback(event);
        }
    }
}
