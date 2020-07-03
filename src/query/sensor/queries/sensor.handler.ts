import { Sensor } from '../models/sensor.model';
import { RetrieveSensorQuery } from './sensor.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(RetrieveSensorQuery)
export class RetrieveSensorQueryHandler implements IQueryHandler<RetrieveSensorQuery> {

  async execute(query: RetrieveSensorQuery) {
      return Sensor.find({_id: query.id});
  }
}
