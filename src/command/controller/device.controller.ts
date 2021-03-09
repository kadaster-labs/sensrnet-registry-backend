import { Body, Controller, Delete, Param, Post, Put, Req, UseFilters, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { v4 } from 'uuid';
import { AccessJwtAuthGuard } from '../../auth/guard/access-jwt-auth.guard';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { RegisterDeviceCommand } from '../command/device/register-device.command';
import { RelocateDeviceCommand } from '../command/device/relocate-device.command';
import { RemoveDeviceCommand } from '../command/device/remove-device.command';
import { UpdateDeviceCommand } from '../command/device/update-device.command';
import { DeviceIdParams } from './model/device/device-id.params';
import { RegisterDeviceBody } from './model/device/register-device.body';
import { UpdateDeviceBody } from './model/device/update-device.body';
import { UpdateLocationBody } from './model/location/update-location.body';

@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@ApiTags('Device')
@Controller('device')
export class DeviceController {
    constructor(
        private readonly commandBus: CommandBus,
    ) { }

    @Post()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Register device' })
    @ApiResponse({ status: 200, description: 'Device registered' })
    @ApiResponse({ status: 400, description: 'Device registration failed' })
    async registerDevice(@Req() req: Request, @Body() deviceBody: RegisterDeviceBody): Promise<Record<string, any>> {
        const deviceId = v4();

        const user: Record<string, any> = req.user;
        await this.commandBus.execute(new RegisterDeviceCommand(deviceId, user.legalEntityId, deviceBody.name,
            deviceBody.description, deviceBody.category, deviceBody.connectivity, deviceBody.location));

        return { deviceId };
    }

    @Put(':deviceId')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Update device' })
    @ApiResponse({ status: 200, description: 'Device updated' })
    @ApiResponse({ status: 400, description: 'Device update failed' })
    async updateDevice(@Req() req: Request, @Param() params: DeviceIdParams,
        @Body() deviceBody: UpdateDeviceBody): Promise<any> {
        const user: Record<string, any> = req.user;
        return await this.commandBus.execute(new UpdateDeviceCommand(params.deviceId, user.legalEntityId,
            deviceBody.name, deviceBody.description, deviceBody.category, deviceBody.connectivity, deviceBody.location));
    }

    @Put(':deviceId/location')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Relocate device' })
    @ApiResponse({ status: 200, description: 'Device relocated' })
    @ApiResponse({ status: 400, description: 'Device relocation failed' })
    async relocateDevice(@Req() req: Request, @Param() params: DeviceIdParams,
        @Body() deviceBody: UpdateLocationBody): Promise<any> {
        const user: Record<string, any> = req.user;
        return await this.commandBus.execute(new RelocateDeviceCommand(params.deviceId, user.legalEntityId, deviceBody));
    }

    @Delete(':deviceId')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Remove device' })
    @ApiResponse({ status: 200, description: 'Device removed' })
    @ApiResponse({ status: 400, description: 'Device removal failed' })
    async removeDevice(@Req() req: Request, @Param() params: DeviceIdParams): Promise<any> {
        const user: Record<string, any> = req.user;
        return await this.commandBus.execute(new RemoveDeviceCommand(params.deviceId, user.legalEntityId));
    }
}
