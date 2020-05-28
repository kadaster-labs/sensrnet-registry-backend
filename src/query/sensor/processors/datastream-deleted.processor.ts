import { Sensor } from "../models/sensor.model";
import { Logger, Injectable } from '@nestjs/common';


@Injectable()
export class DataStreamDeletedProcessor {

    async process(event): Promise<void> {

        const sensorData = {
            $pull: {
                'dataStreams': {
                    dataStreamId: event.data["dataStreamId"]
                }
            }
        }

        Sensor.updateOne({_id: event.data["sensorId"]}, sensorData, (err) => {
            if (err) Logger.error('Error while updating projection.');
        });
    }
}
