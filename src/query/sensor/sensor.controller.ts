import { QueryBus } from '@nestjs/cqrs';
import { SensorIdParams } from './models/id-params';
import { RetrieveSensorQuery } from './queries/sensor.query';
import { RetrieveSensorsQuery } from './queries/sensors.query';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';

@ApiTags('Sensor')
@Controller('Sensor')
export class SensorController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':sensorId')
  @ApiOperation({ summary: 'Retrieve Sensor' })
  @ApiResponse({ status: 200, description: 'Sensor retrieved' })
  @ApiResponse({ status: 400, description: 'Sensor retrieval failed' })
  async retrieveSensor(@Param() sensorIdParams: SensorIdParams) {
    return await this.queryBus.execute(new RetrieveSensorQuery(sensorIdParams.sensorId));
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve Sensors' })
  @ApiResponse({ status: 200, description: 'Sensors retrieved' })
  @ApiResponse({ status: 400, description: 'Sensors retrieval failed' })
  async retrieveSensosr() {
    return await this.queryBus.execute(new RetrieveSensorsQuery());
  }
}
