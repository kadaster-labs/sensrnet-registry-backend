import { Sensor } from "../models/sensor.model";
import { Logger, Injectable } from '@nestjs/common';


@Injectable()
export class SensorActivatedProcessor {

    async process(event): Promise<void> {
        const sensorData = {
            active: true
        };

        Sensor.updateOne({_id: event.data["sensorId"]}, sensorData, (err) => {
            if (err) Logger.error('Error while updating projection.');
        });
    }
}
