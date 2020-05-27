import { Sensor } from "../models/sensor.model";
import { Logger, Injectable } from '@nestjs/common';


@Injectable()
export class SensorDeletedProcessor {

    async process(event): Promise<void> {
        Sensor.deleteOne({_id: event.data["sensorId"]}, (err) => {
            if (err) Logger.error('Error while deleting projection.');
        });
    }
}
