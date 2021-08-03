import { v4 } from 'uuid';
import { CommandBus } from '@nestjs/cqrs';
import { UserRole } from '../../user/schema/user-permissions.schema';
import { ValidatedUser } from '../../auth/validated-user';
import { Roles } from '../../core/guards/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { User } from '../../core/decorators/user.decorator';
import { DeviceIdParams } from './model/device/device-id.params';
import { UpdateDeviceBody } from './model/device/update-device.body';
import { RegisterDeviceBody } from './model/device/register-device.body';
import { UpdateLocationBody } from './model/location/update-location.body';
import { RemoveDeviceCommand } from '../command/device/remove-device.command';
import { UpdateDeviceCommand } from '../command/device/update-device.command';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { RegisterDeviceCommand } from '../command/device/register-device.command';
import { RelocateDeviceCommand } from '../command/device/relocate-device.command';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Param, Post, Put, UseFilters, UseGuards } from '@nestjs/common';

@ApiBearerAuth()
@ApiTags('Device')
@Controller('device')
@UseGuards(RolesGuard)
export class DeviceController {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    @Post()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Register device' })
    @ApiResponse({ status: 200, description: 'Device registered' })
    @ApiResponse({ status: 400, description: 'Device registration failed' })
    async registerDevice(@User() user: ValidatedUser, @Body() deviceBody: RegisterDeviceBody): Promise<Record<string, any>> {
        const deviceId = v4();

        await this.commandBus.execute(new RegisterDeviceCommand(deviceId, user.legalEntityId, deviceBody.name,
            deviceBody.description, deviceBody.category, deviceBody.connectivity, deviceBody.location));

        return { deviceId };
    }

    @Put(':deviceId')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Update device' })
    @ApiResponse({ status: 200, description: 'Device updated' })
    @ApiResponse({ status: 400, description: 'Device update failed' })
    async updateDevice(@User() user: ValidatedUser, @Param() params: DeviceIdParams,
                       @Body() deviceBody: UpdateDeviceBody): Promise<any> {
        return await this.commandBus.execute(new UpdateDeviceCommand(params.deviceId, user.legalEntityId,
            deviceBody.name, deviceBody.description, deviceBody.category, deviceBody.connectivity, deviceBody.location));
    }

    @Put(':deviceId/location')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Relocate device' })
    @ApiResponse({ status: 200, description: 'Device relocated' })
    @ApiResponse({ status: 400, description: 'Device relocation failed' })
    async relocateDevice(@User() user: ValidatedUser, @Param() params: DeviceIdParams,
                         @Body() deviceBody: UpdateLocationBody): Promise<any> {
        return await this.commandBus.execute(new RelocateDeviceCommand(params.deviceId, user.legalEntityId, deviceBody));
    }

    @Delete(':deviceId')
    @UseFilters(new DomainExceptionFilter())
    @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
    @ApiOperation({ summary: 'Remove device' })
    @ApiResponse({ status: 200, description: 'Device removed' })
    @ApiResponse({ status: 400, description: 'Device removal failed' })
    async removeDevice(@User() user: ValidatedUser, @Param() params: DeviceIdParams): Promise<any> {
        return await this.commandBus.execute(new RemoveDeviceCommand(params.deviceId, user.legalEntityId));
    }
}
