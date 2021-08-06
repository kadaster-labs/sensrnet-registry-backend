import { Body, Controller, Delete, Param, Post, Put, UseFilters, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { ValidatedUser } from '../../auth/validated-user';
import { User } from '../../commons/decorators/user.decorator';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';
import { Roles } from '../../commons/guards/roles.decorator';
import { RolesGuard } from '../../commons/guards/roles.guard';
import { UserRole } from '../../commons/user/user.schema';
import { RegisterDeviceCommand } from '../model/device/register-device.command';
import { RelocateDeviceCommand } from '../model/device/relocate-device.command';
import { RemoveDeviceCommand } from '../model/device/remove-device.command';
import { UpdateDeviceCommand } from '../model/device/update-device.command';
import { DeviceIdParams } from './model/device/device-id.params';
import { RegisterDeviceBody } from './model/device/register-device.body';
import { UpdateDeviceBody } from './model/device/update-device.body';
import { UpdateLocationBody } from './model/location/update-location.body';

@ApiBearerAuth()
@ApiTags('Device')
@Controller('device')
@UseGuards(RolesGuard)
export class DeviceController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Register device' })
    @ApiResponse({ status: 200, description: 'Device registered' })
    @ApiResponse({ status: 400, description: 'Device registration failed' })
    async registerDevice(
        @User() user: ValidatedUser,
        @Body() deviceBody: RegisterDeviceBody,
    ): Promise<Record<string, any>> {
        const deviceId = v4();

        await this.commandBus.execute(new RegisterDeviceCommand(user.legalEntityId, { deviceId, ...deviceBody }));

        return { deviceId };
    }

    @Put(':deviceId')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Update device' })
    @ApiResponse({ status: 200, description: 'Device updated' })
    @ApiResponse({ status: 400, description: 'Device update failed' })
    async updateDevice(
        @User() user: ValidatedUser,
        @Param() params: DeviceIdParams,
        @Body() deviceBody: UpdateDeviceBody,
    ): Promise<any> {
        return this.commandBus.execute(
            new UpdateDeviceCommand(user.legalEntityId, { deviceId: params.deviceId, ...deviceBody }),
        );
    }

    @Put(':deviceId/location')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Relocate device' })
    @ApiResponse({ status: 200, description: 'Device relocated' })
    @ApiResponse({ status: 400, description: 'Device relocation failed' })
    async relocateDevice(
        @User() user: ValidatedUser,
        @Param() params: DeviceIdParams,
        @Body() deviceBody: UpdateLocationBody,
    ): Promise<any> {
        return this.commandBus.execute(new RelocateDeviceCommand(params.deviceId, user.legalEntityId, deviceBody));
    }

    @Delete(':deviceId')
    @UseFilters(new DomainExceptionFilter())
    @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
    @ApiOperation({ summary: 'Remove device' })
    @ApiResponse({ status: 200, description: 'Device removed' })
    @ApiResponse({ status: 400, description: 'Device removal failed' })
    async removeDevice(@User() user: ValidatedUser, @Param() params: DeviceIdParams): Promise<any> {
        return this.commandBus.execute(new RemoveDeviceCommand(params.deviceId, user.legalEntityId));
    }
}
