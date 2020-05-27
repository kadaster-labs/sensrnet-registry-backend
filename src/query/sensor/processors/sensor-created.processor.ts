import { Injectable } from "@nestjs/common";
import { Sensor } from "../models/sensor.model";


@Injectable()
export class SensorCreatedProcessor {

    async process(event): Promise<void> {
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
}
