import { Model } from 'mongoose';
import { ISensor } from '../data/sensor.model';
import { InjectModel } from '@nestjs/mongoose';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveSensorQuery } from '../model/sensor.query';

@QueryHandler(RetrieveSensorQuery)
export class RetrieveSensorQueryHandler implements IQueryHandler<RetrieveSensorQuery> {
    constructor(
        @InjectModel('Sensor') private model: Model<ISensor>,
    ) {}

    async execute(query: RetrieveSensorQuery): Promise<any> {
        return this.model.findOne({ _id: query.id });
    }
}
