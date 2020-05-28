import { Sensor } from "../models/sensor.model";
import { Logger, Injectable } from '@nestjs/common';


@Injectable()
export class DataStreamCreatedProcessor {

    async process(event): Promise<void> {
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

        Sensor.updateOne({_id: event.data["sensorId"]}, sensorData, (err) => {
            if (err) Logger.error('Error while updating projection.');
        });
    }
}
