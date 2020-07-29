import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ISensor } from '../models/sensor.model';
import { RetrieveSensorQuery } from './sensor.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(RetrieveSensorQuery)
export class RetrieveSensorQueryHandler implements IQueryHandler<RetrieveSensorQuery> {

    constructor(
        @InjectModel('Sensor') private sensorModel: Model<ISensor>,
    ) {}

    async execute(query: RetrieveSensorQuery) {
        return this.sensorModel.find({_id: query.id});
    }
}
