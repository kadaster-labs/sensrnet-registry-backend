import { Sensor } from "../models/sensor.model";
import { Logger, Injectable } from '@nestjs/common';


@Injectable()
export class SensorLocationUpdatedProcessor {

    async process(event): Promise<void> {
        const sensorData = {
            location: {
                x: event.data["x"],
                y: event.data["y"],
                z: event.data["z"],
                epsgCode: event.data["epsgCode"]
            }
        };

        if (event.data["baseObjectId"]) sensorData['location']['baseObjectId'] = event.data["baseObjectId"];

        Sensor.updateOne({_id: event.data["sensorId"]}, sensorData, (err) => {
            if (err) Logger.error('Error while updating projection.');
        });
    }
}
