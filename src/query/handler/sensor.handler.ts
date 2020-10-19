import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ISensor } from '../data/sensor.model';
import { RetrieveSensorQuery } from '../model/sensor.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(RetrieveSensorQuery)
export class RetrieveSensorQueryHandler implements IQueryHandler<RetrieveSensorQuery> {

    constructor(
        @InjectModel('Sensor') private sensorModel: Model<ISensor>,
    ) {}

    async execute(query: RetrieveSensorQuery): Promise<any> {
        return this.sensorModel.findOne({_id: query.id});
    }
}
