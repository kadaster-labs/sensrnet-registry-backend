import { Sensor } from "../models/sensor.model";
import { Logger, Injectable } from '@nestjs/common';


@Injectable()
export class SensorOwnershipTransferredProcessor {

    async process(event): Promise<void> {
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
            if (err) Logger.error('Error while updating projection.');
        });
    }
}
