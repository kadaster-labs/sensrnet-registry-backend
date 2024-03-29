import { Controller, Param, Post, Put, Body, Delete, UseFilters, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { ValidatedUser } from '../../auth/validated-user';
import { User } from '../../commons/decorators/user.decorator';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';
import { Roles } from '../../commons/guards/roles.decorator';
import { RolesGuard } from '../../commons/guards/roles.guard';
import { UserRole } from '../../commons/user/user.schema';
import { AddSensorCommand } from '../model/sensor/add-sensor.command';
import { RemoveSensorCommand } from '../model/sensor/remove-sensor.command';
import { UpdateSensorCommand } from '../model/sensor/update-sensor.command';
import { DeviceIdParams } from './model/device/device-id.params';
import { AddSensorBody } from './model/sensor/add-sensor.body';
import { SensorIdParams } from './model/sensor/sensorid.params';
import { UpdateSensorBody } from './model/sensor/update-sensor.body';

@ApiBearerAuth()
@ApiTags('Sensor')
@Controller('device')
@UseGuards(RolesGuard)
export class SensorController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post(':deviceId/sensor')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Register sensor' })
    @ApiResponse({ status: 200, description: 'Sensor registered' })
    @ApiResponse({ status: 400, description: 'Sensor registration failed' })
    async registerSensor(
        @User() user: ValidatedUser,
        @Param() params: DeviceIdParams,
        @Body() sensorBody: AddSensorBody,
    ): Promise<Record<string, any>> {
        const sensorId = v4();

        await this.commandBus.execute(
            new AddSensorCommand(params.deviceId, user.legalEntityId, { sensorId, ...sensorBody }),
        );

        return { sensorId };
    }

    @Put(':deviceId/sensor/:sensorId')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Update sensor' })
    @ApiResponse({ status: 200, description: 'Sensor updated' })
    @ApiResponse({ status: 400, description: 'Sensor update failed' })
    async updateSensor(
        @User() user: ValidatedUser,
        @Param() params: SensorIdParams,
        @Body() sensorBody: UpdateSensorBody,
    ): Promise<any> {
        return this.commandBus.execute(
            new UpdateSensorCommand(params.deviceId, user.legalEntityId, { sensorId: params.sensorId, ...sensorBody }),
        );
    }

    @Delete(':deviceId/sensor/:sensorId')
    @UseFilters(new DomainExceptionFilter())
    @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
    @ApiOperation({ summary: 'Remove sensor' })
    @ApiResponse({ status: 200, description: 'Sensor removed' })
    @ApiResponse({ status: 400, description: 'Sensor removal failed' })
    async removeSensor(@User() user: ValidatedUser, @Param() params: SensorIdParams): Promise<any> {
        return this.commandBus.execute(new RemoveSensorCommand(params.sensorId, user.legalEntityId, params.deviceId));
    }
}
