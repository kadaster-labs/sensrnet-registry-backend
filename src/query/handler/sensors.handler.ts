import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ISensor } from '../data/sensor.model';
import { RetrieveSensorsQuery } from '../model/sensors.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(RetrieveSensorsQuery)
export class RetrieveSensorsQueryHandler implements IQueryHandler<RetrieveSensorsQuery> {

    constructor(
        @InjectModel('Sensor') private sensorModel: Model<ISensor>,
    ) {}

    async execute(retrieveSensorsQuery: RetrieveSensorsQuery): Promise<any> {
        let kwargs = {};
        if (retrieveSensorsQuery.bottomLeftLongitude && retrieveSensorsQuery.bottomLeftLatitude &&
            retrieveSensorsQuery.upperRightLongitude && retrieveSensorsQuery.upperRightLatitude) {
            kwargs = {
                location: {
                    $geoWithin: {
                        $box: [
                            [retrieveSensorsQuery.bottomLeftLongitude, retrieveSensorsQuery.bottomLeftLatitude],
                            [retrieveSensorsQuery.upperRightLongitude, retrieveSensorsQuery.upperRightLatitude],
                        ],
                    },
                },
            };
        }
        return this.sensorModel.find(kwargs);
    }
}
