import { request, Request } from 'express';
import { QueryBus } from '@nestjs/cqrs';
import { SensorIdParams } from './model/id-params';
import { RetrieveSensorQuery } from '../model/sensor.query';
import { RetrieveSensorsQuery } from '../model/sensors.query';
import { RetrieveSensorsParams } from './model/retrieve-sensors-params';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Param, Query, UseGuards, UseFilters, Req } from '@nestjs/common';
import { AuthenticatedGuard } from '../../auth/authenticated.guard';
import { UserToken } from '../../auth/models/user-token';
import { UserService } from '../../user/user.service';

@ApiTags('Sensor')
@Controller('sensor')
@UseFilters(new DomainExceptionFilter())
export class SensorController {
  constructor(
      private readonly queryBus: QueryBus,
      private readonly userService: UserService,
  ) {}

  @Get(':sensorId')
  @ApiOperation({ summary: 'Retrieve Sensor' })
  @ApiResponse({ status: 200, description: 'Sensor retrieved' })
  @ApiResponse({ status: 400, description: 'Sensor retrieval failed' })
  async retrieveSensor(@Param() sensorIdParams: SensorIdParams): Promise<any> {
    return await this.queryBus.execute(new RetrieveSensorQuery(sensorIdParams.sensorId));
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({ summary: 'Retrieve Sensors' })
  @ApiResponse({ status: 200, description: 'Sensors retrieved' })
  @ApiResponse({ status: 400, description: 'Sensors retrieval failed' })
  async retrieveSensors(@Req() req: Request, @Query() sensorParams: RetrieveSensorsParams): Promise<any> {
    const user: UserToken = req.user as UserToken;
    let requestOrganizationId: string;
    if (user) {
      requestOrganizationId = await this.userService.getOrganizationId(user.userinfo.sub);
    }
    return await this.queryBus.execute(new RetrieveSensorsQuery(requestOrganizationId, sensorParams.bottomLeftLongitude,
        sensorParams.bottomLeftLatitude, sensorParams.upperRightLongitude, sensorParams.upperRightLatitude,
        sensorParams.pageIndex, sensorParams.organizationId));
  }
}
