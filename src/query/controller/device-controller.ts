import { Request } from 'express';
import { QueryBus } from '@nestjs/cqrs';
import { DeviceIdParams } from './model/device-id-params';
import { jwtConstants } from '../../auth/constants';
import { RetrieveDeviceQuery } from './query/device.query';
import { RetrieveDevicesQuery } from './query/devices.query';
import { AccessJwtAuthGuard } from '../../auth/guard/access-jwt-auth.guard';
import { RetrieveDevicesParams } from './model/retrieve-devices-params';
import { AccessAnonymousAuthGuard } from '../../auth/guard/access-anonymous-auth.guard';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Param, Query, UseGuards, UseFilters, Req } from '@nestjs/common';

@ApiTags('Device')
@Controller('device')
@UseFilters(new DomainExceptionFilter())
export class DeviceController {
  constructor(
      private readonly queryBus: QueryBus,
  ) {}

  @Get(':deviceId')
  @ApiBearerAuth()
  @UseGuards(AccessJwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve Device' })
  @ApiResponse({ status: 200, description: 'Device retrieved' })
  @ApiResponse({ status: 400, description: 'Device retrieval failed' })
  async retrieveDevice(@Param() deviceIdParams: DeviceIdParams): Promise<any> {
    return await this.queryBus.execute(new RetrieveDeviceQuery(deviceIdParams.deviceId));
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(jwtConstants.enabled ? AccessJwtAuthGuard : AccessAnonymousAuthGuard)
  @ApiOperation({ summary: 'Retrieve Devices' })
  @ApiResponse({ status: 200, description: 'Devices retrieved' })
  @ApiResponse({ status: 400, description: 'Devices retrieval failed' })
  async retrieveSensors(@Req() req: Request, @Query() devicesParams: RetrieveDevicesParams): Promise<any> {
    const user: Record<string, any> = req.user;
    const requestLegalEntityId = user ? user.legalEntityId : undefined;
    return await this.queryBus.execute(new RetrieveDevicesQuery(requestLegalEntityId, devicesParams.bottomLeftLongitude,
        devicesParams.bottomLeftLatitude, devicesParams.upperRightLongitude, devicesParams.upperRightLatitude,
        devicesParams.pageIndex, devicesParams.legalEntityId));
  }
}
