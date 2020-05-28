import { Sensor } from "../models/sensor.model";
import { Logger, Injectable } from '@nestjs/common';


@Injectable()
export class SensorUpdatedProcessor {

    async process(event): Promise<void> {
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

        Sensor.updateOne({_id: event.data["sensorId"]}, sensorData, (err) => {
            if (err) Logger.error('Error while updating projection.');
        });
    }
}
