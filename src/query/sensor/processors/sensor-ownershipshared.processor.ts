import { Sensor } from "../models/sensor.model";
import { Logger, Injectable } from '@nestjs/common';


@Injectable()
export class SensorOwnershipSharedProcessor {

    async process(event): Promise<void> {
        const updateSensorData = {
            $push: {
                ownerIds: {
                    $each: event.data["ownerIds"]
                }
            }
        };

        Sensor.updateOne({_id: event.data["sensorId"]}, updateSensorData, (err) => {
            if (err) Logger.error('Error while updating projection.');
        });
    }
}
