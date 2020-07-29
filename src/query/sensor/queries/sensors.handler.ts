import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ISensor } from '../models/sensor.model';
import { RetrieveSensorsQuery } from './sensors.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(RetrieveSensorsQuery)
export class RetrieveSensorsQueryHandler implements IQueryHandler<RetrieveSensorsQuery> {

    constructor(
        @InjectModel('Sensor') private sensorModel: Model<ISensor>,
    ) {}

    async execute(retrieveSensorsQuery: RetrieveSensorsQuery) {
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
