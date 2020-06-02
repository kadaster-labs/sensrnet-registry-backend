import { Sensor } from "../models/sensor.model"
import { RetrieveSensorQuery } from './sensor.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';


@QueryHandler(RetrieveSensorQuery)
export class RetrieveSensorQueryHandler implements IQueryHandler<RetrieveSensorQuery> {
  constructor() {}

  async execute(query: RetrieveSensorQuery) {
      return await Sensor.find({_id: query.id});
  }
}
