import { Controller, Get, Param, Query, UseFilters } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidatedUser } from '../../auth/validated-user';
import { InjectUser } from '../../commons/decorators/user.decorator';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';
import { RetrieveDeviceQuery } from '../model/device.query';
import { RetrieveDevicesQuery } from '../model/devices.query';
import { DeviceIdParams } from './model/device-id-params';
import { RetrieveDevicesParams } from './model/retrieve-devices-params';

@ApiTags('Device')
@Controller('device')
@UseFilters(new DomainExceptionFilter())
export class DeviceController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get(':deviceId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retrieve Device' })
    @ApiResponse({ status: 200, description: 'Device retrieved' })
    @ApiResponse({ status: 400, description: 'Device retrieval failed' })
    async retrieveDevice(@Param() deviceIdParams: DeviceIdParams): Promise<any> {
        return this.queryBus.execute(new RetrieveDeviceQuery(deviceIdParams.deviceId));
    }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retrieve Devices' })
    @ApiResponse({ status: 200, description: 'Devices retrieved' })
    @ApiResponse({ status: 400, description: 'Devices retrieval failed' })
    async retrieveDevices(@InjectUser() user: ValidatedUser, @Query() devicesParams: RetrieveDevicesParams): Promise<any> {
        const requestLegalEntityId = user ? user.legalEntityId : undefined;

        const pageSize = typeof devicesParams.pageSize === 'undefined' ? undefined : Number(devicesParams.pageSize);
        const pageIndex = typeof devicesParams.pageIndex === 'undefined' ? undefined : Number(devicesParams.pageIndex);
        return this.queryBus.execute(
            new RetrieveDevicesQuery(devicesParams, requestLegalEntityId, pageIndex, pageSize),
        );
    }
}
