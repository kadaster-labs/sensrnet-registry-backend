import { v4 } from 'uuid';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { SensorIdParams } from './model/sensor/sensorid.params';
import { UpdateSensorBody } from './model/sensor/update-sensor.body';
import { AccessJwtAuthGuard } from '../../auth/access-jwt-auth.guard';
import { RegisterSensorBody } from './model/sensor/register-sensor.body';
import { UpdateSensorCommand } from '../command/sensor/update-sensor.command';
import { DeleteSensorCommand } from '../command/sensor/delete-sensor.command';
import { RegisterSensorCommand } from '../command/sensor/register-sensor.command';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Param, Post, Put, Body, Delete, UseFilters, Req, UseGuards } from '@nestjs/common';

@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@ApiTags('Sensor')
@Controller('sensor')
export class SensorController {
  constructor(
      private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Register sensor' })
  @ApiResponse({ status: 200, description: 'Sensor registered' })
  @ApiResponse({ status: 400, description: 'Sensor registration failed' })
  async registerSensor(@Req() req: Request, @Body() sensorBody: RegisterSensorBody): Promise<Record<string, any>> {
    const sensorId = v4();
    for (const dataStream of sensorBody.dataStreams) {
      dataStream.dataStreamId = v4();
    }

    const user: Record<string, any> = req.user;
    await this.commandBus.execute(new RegisterSensorCommand(sensorId, user.legalEntityId, sensorBody.deviceId, sensorBody.name,
        sensorBody.description, sensorBody.supplier, sensorBody.manufacturer, sensorBody.documentationUrl, sensorBody.active,
        sensorBody.dataStreams));

    return { sensorId };
  }

  @Put(':sensorId')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update sensor' })
  @ApiResponse({ status: 200, description: 'Sensor updated' })
  @ApiResponse({ status: 400, description: 'Sensor update failed' })
  async updateSensor(@Req() req: Request, @Param() params: SensorIdParams, @Body() sensorBody: UpdateSensorBody): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new UpdateSensorCommand(params.sensorId, user.legalEntityId, sensorBody.deviceId,
        sensorBody.name, sensorBody.description, sensorBody.supplier, sensorBody.manufacturer, sensorBody.documentationUrl,
        sensorBody.active));
  }

  @Delete(':sensorId')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove sensor' })
  @ApiResponse({ status: 200, description: 'Sensor removed' })
  @ApiResponse({ status: 400, description: 'Sensor removal failed' })
  async removeSensor(@Req() req: Request, @Param() params: SensorIdParams): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new DeleteSensorCommand(params.sensorId, user.legalEntityId));
  }
}
