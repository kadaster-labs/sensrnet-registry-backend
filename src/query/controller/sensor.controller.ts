import { QueryBus } from '@nestjs/cqrs';
import { SensorIdParams } from './model/id-params';
import { RetrieveSensorQuery } from '../model/sensor.query';
import { RetrieveSensorsQuery } from '../model/sensors.query';
import { RetrieveSensorsParams } from './model/retrieve-sensors-params';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Param, Query, UseFilters, Req } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

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
  @ApiOperation({ summary: 'Retrieve Sensors' })
  @ApiResponse({ status: 200, description: 'Sensors retrieved' })
  @ApiResponse({ status: 400, description: 'Sensors retrieval failed' })
  async retrieveSensors(@Req() req, @Query() sensorParams: RetrieveSensorsParams): Promise<any> {
    const { userId } = req.user;
    let requestOrganizationId: string;
    if (userId) {
      requestOrganizationId = await this.userService.getOrganizationId(userId);
    }
    return await this.queryBus.execute(new RetrieveSensorsQuery(requestOrganizationId, sensorParams.bottomLeftLongitude,
        sensorParams.bottomLeftLatitude, sensorParams.upperRightLongitude, sensorParams.upperRightLatitude,
        sensorParams.pageIndex, sensorParams.organizationId));
  }
}
