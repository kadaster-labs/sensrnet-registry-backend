import { Request } from 'express';
import { QueryBus } from '@nestjs/cqrs';
import { SensorIdParams } from './model/id-params';
import { jwtConstants } from '../../auth/constants';
import { RetrieveSensorQuery } from '../model/sensor.query';
import { RetrieveSensorsQuery } from '../model/sensors.query';
import { AccessJwtAuthGuard } from '../../auth/access-jwt-auth.guard';
import { RetrieveSensorsParams } from './model/retrieve-sensors-params';
import { AccessAnonymousAuthGuard } from '../../auth/access-anonymous-auth.guard';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Param, Query, UseGuards, UseFilters, Req } from '@nestjs/common';

@ApiTags('Sensor')
@Controller('Sensor')
@UseFilters(new DomainExceptionFilter())
export class SensorController {
  constructor(
      private readonly queryBus: QueryBus,
  ) {}

  @Get(':sensorId')
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve Sensor' })
  @ApiResponse({ status: 200, description: 'Sensor retrieved' })
  @ApiResponse({ status: 400, description: 'Sensor retrieval failed' })
  async retrieveSensor(@Param() sensorIdParams: SensorIdParams): Promise<any> {
    return await this.queryBus.execute(new RetrieveSensorQuery(sensorIdParams.sensorId));
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(jwtConstants.enabled ? AccessJwtAuthGuard : AccessAnonymousAuthGuard)
  @ApiOperation({ summary: 'Retrieve Sensors' })
  @ApiResponse({ status: 200, description: 'Sensors retrieved' })
  @ApiResponse({ status: 400, description: 'Sensors retrieval failed' })
  async retrieveSensors(@Req() req: Request, @Query() sensorParams: RetrieveSensorsParams): Promise<any> {
    const user: Record<string, any> = req.user;
    const requestOwnerId = user ? user.ownerId : undefined;
    return await this.queryBus.execute(new RetrieveSensorsQuery(requestOwnerId, sensorParams.bottomLeftLongitude,
        sensorParams.bottomLeftLatitude, sensorParams.upperRightLongitude, sensorParams.upperRightLatitude,
        sensorParams.pageIndex, sensorParams.ownerId));
  }
}
