import { plainToClass } from "class-transformer";
import { Injectable, Logger } from "@nestjs/common";
import {
    eventType,
    SensorCreated,
    SensorUpdated,
    SensorDeleted,
    SensorActivated,
    SensorDeactivated,
    SensorOwnershipShared,
    SensorOwnershipTransferred,
    DataStreamCreated,
    DataStreamDeleted,
    SensorLocationUpdated
} from "src/events/sensor/events";
import { Sensor } from "../models/sensor.model";


@Injectable()
export class SensorProcessor {

    async process(event): Promise<void> {

        event = plainToClass(eventType.getType(event.eventType), event);

        if (event instanceof SensorCreated) {
            this.processCreated(event);
        }
        else if (event instanceof SensorUpdated) {
            this.processUpdated(event);
        }
        else if (event instanceof SensorDeleted) {
            this.processDeleted(event);
        }
        else if (event instanceof SensorActivated) {
            this.processActivated(event);
        }
        else if (event instanceof SensorDeactivated) {
            this.processDeactivated(event);
        }
        else if (event instanceof SensorOwnershipShared) {
            this.processOwnershipShared(event);
        }
        else if (event instanceof SensorOwnershipTransferred) {
            this.processOwnershipTransferred(event);
        }
        else if (event instanceof DataStreamCreated) {
            this.processDataStreamCreated(event);
        }
        else if (event instanceof DataStreamDeleted) {
            this.processDataStreamDeleted(event);
        }
        else if (event instanceof SensorLocationUpdated) {
            this.processLocationUpdated(event);
        }
        else {
            Logger.warn(`Caught unsupported event: ${event}`)
        }
    }
    async processCreated(event: SensorCreated): Promise<void> {
        const sensorData = {
            _id: event.data["sensorId"],
            nodeId: event.data["nodeId"],
            location: event.data["location"],
            active: event.data["active"],
            typeName: event.data["typeName"]
        };

        if (event.data["ownerIds"]) sensorData["ownerIds"] = event.data["ownerIds"];
        if (event.data["name"]) sensorData["name"] = event.data["name"];
        if (event.data["aim"]) sensorData["aim"] = event.data["aim"];
        if (event.data["description"]) sensorData["description"] = event.data["description"];
        if (event.data["manufacturer"]) sensorData["manufacturer"] = event.data["manufacturer"];
        if (event.data["observationArea"]) sensorData["observationArea"] = event.data["observationArea"];
        if (event.data["documentationUrl"]) sensorData["documentationUrl"] = event.data["documentationUrl"];
        if (event.data["theme"]) sensorData["theme"] = event.data["theme"];
        if (event.data["typeDetails"]) sensorData["typeDetails"] = event.data["typeDetails"];

        new Sensor(sensorData).save();
    }

    async processUpdated(event: SensorUpdated): Promise<void> {
        const sensorData = {};

        if (event.data["nodeId"]) sensorData["nodeId"] = event.data["nodeId"];
        if (event.data["location"]) sensorData["location"] = event.data["location"];
        if (event.data["active"]) sensorData["active"] = event.data["active"];
        if (event.data["typeName"]) sensorData["typeName"] = event.data["typeName"];
        if (event.data["ownerIds"]) sensorData["ownerIds"] = event.data["ownerIds"];
        if (event.data["name"]) sensorData["name"] = event.data["name"];
        if (event.data["aim"]) sensorData["aim"] = event.data["aim"];
        if (event.data["description"]) sensorData["description"] = event.data["description"];
        if (event.data["manufacturer"]) sensorData["manufacturer"] = event.data["manufacturer"];
        if (event.data["observationArea"]) sensorData["observationArea"] = event.data["observationArea"];
        if (event.data["documentationUrl"]) sensorData["documentationUrl"] = event.data["documentationUrl"];
        if (event.data["theme"]) sensorData["theme"] = event.data["theme"];
        if (event.data["typeDetails"]) sensorData["typeDetails"] = event.data["typeDetails"];

        Sensor.updateOne({ _id: event.data["sensorId"] }, sensorData, (err) => {
            if (err) this.logError(event)
        });
    }

    async processDeleted(event: SensorDeleted): Promise<void> {
        Sensor.deleteOne({ _id: event.data["sensorId"] }, (err) => {
            if (err) Logger.error('Error while deleting projection.');
        });
    }

    async processActivated(event: SensorActivated): Promise<void> {
        const sensorData = {
            active: true
        };

        Sensor.updateOne({ _id: event.data["sensorId"] }, sensorData, (err) => {
            if (err) this.logError(event)
        });
    }

    async processDeactivated(event: SensorDeactivated): Promise<void> {
        const sensorData = {
            active: false
        };

        Sensor.updateOne({ _id: event.data["sensorId"] }, sensorData, (err) => {
            if (err) this.logError(event)
        });
    }

    async processOwnershipShared(event: SensorOwnershipShared): Promise<void> {
        const updateSensorData = {
            $push: {
                ownerIds: {
                    $each: event.data["ownerIds"]
                }
            }
        };

        Sensor.updateOne({ _id: event.data["sensorId"] }, updateSensorData, (err) => {
            if (err) this.logError(event)
        });
    }

    async processOwnershipTransferred(event: SensorOwnershipTransferred): Promise<void> {
        const filterData = {
            _id: event.data["sensorId"],
            ownerIds: event.data["oldOwnerId"]
        };

        const updateSensorData = {
            $set: {
                'ownerIds.$': event.data["newOwnerId"]
            }
        };

        Sensor.updateOne(filterData, updateSensorData, (err) => {
            if (err) this.logError(event)
        });
    }

    async processDataStreamCreated(event: DataStreamCreated): Promise<void> {
        const dataStreamData = {
            dataStreamId: event.data["dataStreamId"],
            name: event.data["name"],
            isPublic: event.data["isPublic"],
            isOpenData: event.data["isOpenData"],
            isReusable: event.data["isReusable"],
        };

        if (event.data["reason"]) dataStreamData["reason"] = event.data["reason"];
        if (event.data["description"]) dataStreamData["description"] = event.data["description"];
        if (event.data["observedProperty"]) dataStreamData["observedProperty"] = event.data["observedProperty"];
        if (event.data["unitOfMeasurement"]) dataStreamData["unitOfMeasurement"] = event.data["unitOfMeasurement"];
        if (event.data["documentationUrl"]) dataStreamData["documentationUrl"] = event.data["documentationUrl"];
        if (event.data["dataLink"]) dataStreamData["dataLink"] = event.data["dataLink"];
        if (event.data["dataFrequency"]) dataStreamData["dataFrequency"] = event.data["dataFrequency"];
        if (event.data["dataQuality"]) dataStreamData["dataQuality"] = event.data["dataQuality"];

        const sensorData = {
            $push: {
                dataStreams: dataStreamData
            }
        }

        Sensor.updateOne({ _id: event.data["sensorId"] }, sensorData, (err) => {
            if (err) this.logError(event)
        });
    }

    async processDataStreamDeleted(event: DataStreamDeleted): Promise<void> {
        const sensorData = {
            $pull: {
                'dataStreams': {
                    dataStreamId: event.data["dataStreamId"]
                }
            }
        }

        Sensor.updateOne({ _id: event.data["sensorId"] }, sensorData, (err) => {
            if (err) this.logError(event)
        });
    }

    async processLocationUpdated(event: SensorLocationUpdated): Promise<void> {
        const sensorData = {
            location: {
                x: event.data["x"],
                y: event.data["y"],
                z: event.data["z"],
                epsgCode: event.data["epsgCode"]
            }
        };

        if (event.data["baseObjectId"]) sensorData['location']['baseObjectId'] = event.data["baseObjectId"];

        Sensor.updateOne({ _id: event.data["sensorId"] }, sensorData, (err) => {
            if (err) this.logError(event)
        });
    }

    private logError(event) {
        Logger.error(`Error while updating projection for ${event.eventType}.`);
    }

}