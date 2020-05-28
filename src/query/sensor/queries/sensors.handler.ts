import { Sensor } from "../models/sensor.model"
import { RetrieveSensorsQuery } from './sensors.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';


@QueryHandler(RetrieveSensorsQuery)
export class RetrieveSensorsQueryHandler implements IQueryHandler<RetrieveSensorsQuery> {
  constructor() {}

  async execute(_: RetrieveSensorsQuery) {
      return await Sensor.find();
  }
}
