import { v4 } from 'uuid';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { UserRole } from '../../user/model/user.model';
import { Roles } from '../../core/guards/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { AddSensorBody } from './model/sensor/add-sensor.body';
import { SensorIdParams } from './model/sensor/sensorid.params';
import { DeviceIdParams } from './model/device/device-id.params';
import { UpdateSensorBody } from './model/sensor/update-sensor.body';
import { AddSensorCommand } from '../command/sensor/add-sensor.command';
import { AccessJwtAuthGuard } from '../../auth/guard/access-jwt-auth.guard';
import { UpdateSensorCommand } from '../command/sensor/update-sensor.command';
import { RemoveSensorCommand } from '../command/sensor/remove-sensor.command';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Param, Post, Put, Body, Delete, UseFilters, Req, UseGuards } from '@nestjs/common';

@ApiBearerAuth()
@ApiTags('Sensor')
@Controller('device')
@UseGuards(AccessJwtAuthGuard, RolesGuard)
export class SensorController {
  constructor(
      private readonly commandBus: CommandBus,
  ) {}

  @Post(':deviceId/sensor')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Register sensor' })
  @ApiResponse({ status: 200, description: 'Sensor registered' })
  @ApiResponse({ status: 400, description: 'Sensor registration failed' })
  async registerSensor(@Req() req: Request, @Param() params: DeviceIdParams,
                       @Body() sensorBody: AddSensorBody): Promise<Record<string, any>> {
    const sensorId = v4();

    const user: Record<string, any> = req.user;
    await this.commandBus.execute(new AddSensorCommand(sensorId, user.legalEntityId, params.deviceId,
        sensorBody.name, sensorBody.description, sensorBody.type, sensorBody.manufacturer, sensorBody.supplier,
        sensorBody.documentation));

    return { sensorId };
  }

  @Put(':deviceId/sensor/:sensorId')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update sensor' })
  @ApiResponse({ status: 200, description: 'Sensor updated' })
  @ApiResponse({ status: 400, description: 'Sensor update failed' })
  async updateSensor(@Req() req: Request, @Param() params: SensorIdParams,
                     @Body() sensorBody: UpdateSensorBody): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new UpdateSensorCommand(params.sensorId, user.legalEntityId, params.deviceId,
        sensorBody.name, sensorBody.description, sensorBody.type, sensorBody.manufacturer, sensorBody.supplier,
        sensorBody.documentation));
  }

  @Delete(':deviceId/sensor/:sensorId')
  @UseFilters(new DomainExceptionFilter())
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Remove sensor' })
  @ApiResponse({ status: 200, description: 'Sensor removed' })
  @ApiResponse({ status: 400, description: 'Sensor removal failed' })
  async removeSensor(@Req() req: Request, @Param() params: SensorIdParams): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new RemoveSensorCommand(params.sensorId, user.legalEntityId, params.deviceId));
  }
}
