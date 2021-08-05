import { QueryBus } from '@nestjs/cqrs';
import { ValidatedUser } from '../../auth/validated-user';
import { DeviceIdParams } from './model/device-id-params';
import { RetrieveDeviceQuery } from '../model/device.query';
import { User } from '../../commons/decorators/user.decorator';
import { RetrieveDevicesQuery } from '../model/devices.query';
import { RetrieveDevicesParams } from './model/retrieve-devices-params';
import { Controller, Get, Param, Query, UseFilters } from '@nestjs/common';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Device')
@Controller('device')
@UseFilters(new DomainExceptionFilter())
export class DeviceController {
  constructor(
      private readonly queryBus: QueryBus,
  ) {}

  @Get(':deviceId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve Device' })
  @ApiResponse({ status: 200, description: 'Device retrieved' })
  @ApiResponse({ status: 400, description: 'Device retrieval failed' })
  async retrieveDevice(@Param() deviceIdParams: DeviceIdParams): Promise<any> {
    return await this.queryBus.execute(new RetrieveDeviceQuery(deviceIdParams.deviceId));
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve Devices' })
  @ApiResponse({ status: 200, description: 'Devices retrieved' })
  @ApiResponse({ status: 400, description: 'Devices retrieval failed' })
  async retrieveDevices(@User() user: ValidatedUser, @Query() devicesParams: RetrieveDevicesParams): Promise<any> {
    const requestLegalEntityId = user ? user.legalEntityId : undefined;

    const pageSize = typeof devicesParams.pageSize === 'undefined' ? undefined : Number(devicesParams.pageSize);
    const pageIndex = typeof devicesParams.pageIndex === 'undefined' ? undefined : Number(devicesParams.pageIndex);
    return await this.queryBus.execute(new RetrieveDevicesQuery(requestLegalEntityId, devicesParams.bottomLeftLongitude,
        devicesParams.bottomLeftLatitude, devicesParams.upperRightLongitude, devicesParams.upperRightLatitude,
        pageIndex, pageSize, devicesParams.legalEntityId, devicesParams.sortField, devicesParams.sortDirection, devicesParams.name));
  }
}
