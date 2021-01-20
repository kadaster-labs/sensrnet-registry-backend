import { v4 } from 'uuid';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { LocationBody } from './model/location.body';
import { SensorIdParams } from './model/sensorid.params';
import { UpdateSensorBody } from './model/update-sensor.body';
import { DataStreamIdParams } from './model/datastreamid.params';
import { ShareOwnershipBody } from './model/share-ownership.body';
import { RegisterSensorBody } from './model/register-sensor.body';
import { UpdateLocationBody } from './model/update-location.body';
import { CreateSensorCommand } from '../model/create-sensor.command';
import { UpdateSensorCommand } from '../model/update-sensor.command';
import { DeleteSensorCommand } from '../model/delete-sensor.command';
import { CreateDatastreamBody } from './model/create-datastream.body';
import { AccessJwtAuthGuard } from '../../auth/access-jwt-auth.guard';
import { UpdateDatastreamBody } from './model/update-datastream.body';
import { TransferOwnershipBody } from './model/transfer-ownership.body';
import { ActivateSensorCommand } from '../model/activate-sensor.command';
import { CreateDatastreamCommand } from '../model/create-datastream.command';
import { DeleteDatastreamCommand } from '../model/delete-datastream.command';
import { DeactivateSensorCommand } from '../model/deactivate-sensor.command';
import { UpdateDatastreamCommand } from '../model/update-datastream.command';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShareSensorOwnershipCommand } from '../model/share-sensor-ownership.command';
import { UpdateSensorLocationCommand } from '../model/update-sensor-location.command';
import { TransferSensorOwnershipCommand } from '../model/transfer-sensor-ownership.command';
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
    await this.commandBus.execute(new CreateSensorCommand(sensorId, user.organizationId, sensorBody.name, sensorBody.location,
        sensorBody.baseObjectId, sensorBody.dataStreams, sensorBody.aim, sensorBody.description, sensorBody.manufacturer,
        sensorBody.active, sensorBody.observationArea, sensorBody.documentationUrl, sensorBody.theme, sensorBody.category,
        sensorBody.typeName, sensorBody.typeDetails));

    return { sensorId };
  }

  @Put(':sensorId/details')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update sensor details' })
  @ApiResponse({ status: 200, description: 'Sensor updated' })
  @ApiResponse({ status: 400, description: 'Sensor update failed' })
  async updateSensorDetails(@Req() req: Request, @Param() params: SensorIdParams, @Body() sensorBody: UpdateSensorBody): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new UpdateSensorCommand(params.sensorId, user.organizationId, sensorBody.name,
        sensorBody.aim, sensorBody.description, sensorBody.manufacturer, sensorBody.observationArea, sensorBody.documentationUrl,
        sensorBody.theme, sensorBody.category, sensorBody.typeName, sensorBody.typeDetails));
  }

  @Put(':sensorId/transfer')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Transfer sensor ownership' })
  @ApiResponse({ status: 200, description: 'Sensor ownership transferred' })
  @ApiResponse({ status: 400, description: 'Sensor ownership transfer failed' })
  async transferSensorOwnership(@Req() req: Request, @Param() params: SensorIdParams,
                                @Body() transferOwnershipBody: TransferOwnershipBody): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new TransferSensorOwnershipCommand(params.sensorId,
        user.organizationId, transferOwnershipBody.newOrganizationId));
  }

  @Put(':sensorId/share')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Share sensor ownership' })
  @ApiResponse({ status: 200, description: 'Sensor ownership shared' })
  @ApiResponse({ status: 400, description: 'Sensor ownership sharing failed' })
  async shareSensorOwnership(@Req() req: Request, @Param() params: SensorIdParams,
                             @Body() shareOwnershipBody: ShareOwnershipBody): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new ShareSensorOwnershipCommand(params.sensorId, user.organizationId,
        shareOwnershipBody.organizationId));
  }

  @Put(':sensorId/location')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update sensor location' })
  @ApiResponse({ status: 200, description: 'Sensor location updated' })
  @ApiResponse({ status: 400, description: 'Sensor location update failed' })
  async relocateSensor(@Req() req: Request, @Param() params: SensorIdParams,
                       @Body() locationBody: UpdateLocationBody): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new UpdateSensorLocationCommand(params.sensorId, user.organizationId,
        [locationBody.location[0], locationBody.location[1], locationBody.location[2]], locationBody.baseObjectId));
  }

  @Put(':sensorId/activate')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Activate sensor' })
  @ApiResponse({ status: 200, description: 'Sensor activated' })
  @ApiResponse({ status: 400, description: 'Sensor activation failed' })
  async activateSensor(@Req() req: Request, @Param() params: SensorIdParams): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new ActivateSensorCommand(params.sensorId, user.organizationId));
  }

  @Put(':sensorId/deactivate')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Deactivate sensor' })
  @ApiResponse({ status: 200, description: 'Sensor deactivated' })
  @ApiResponse({ status: 400, description: 'Sensor deactivation failed' })
  async deactivateSensor(@Req() req: Request, @Param() params: SensorIdParams): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new DeactivateSensorCommand(params.sensorId, user.organizationId));
  }

  @Post(':sensorId/datastream')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Add sensor dataStream' })
  @ApiResponse({ status: 200, description: 'Datastream added to sensor' })
  @ApiResponse({ status: 400, description: 'Datastream addition failed' })
  async addSensorDatastream(@Req() req: Request, @Param() params: SensorIdParams,
                            @Body() dataStreamBody: CreateDatastreamBody): Promise<any> {
    const dataStreamId = v4();
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new CreateDatastreamCommand(params.sensorId, user.organizationId,
        dataStreamId, dataStreamBody.name, dataStreamBody.reason, dataStreamBody.description,
        dataStreamBody.observedProperty, dataStreamBody.unitOfMeasurement, dataStreamBody.isPublic,
        dataStreamBody.isOpenData, dataStreamBody.isReusable, dataStreamBody.documentationUrl,
        dataStreamBody.dataLink, dataStreamBody.dataFrequency, dataStreamBody.dataQuality));
  }

  @Put(':sensorId/datastream/:dataStreamId')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update sensor dataStream' })
  @ApiResponse({ status: 200, description: 'Datastream updated' })
  @ApiResponse({ status: 400, description: 'Datastream update failed' })
  async updateSensorDatastream(@Req() req: Request, @Param() params: DataStreamIdParams,
                               @Body() dataStreamBody: UpdateDatastreamBody): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new UpdateDatastreamCommand(params.sensorId, user.organizationId,
        params.dataStreamId, dataStreamBody.name, dataStreamBody.reason, dataStreamBody.description,
        dataStreamBody.observedProperty, dataStreamBody.unitOfMeasurement, dataStreamBody.isPublic,
        dataStreamBody.isOpenData, dataStreamBody.isReusable, dataStreamBody.documentationUrl,
        dataStreamBody.dataLink, dataStreamBody.dataFrequency, dataStreamBody.dataQuality));
  }

  @Delete(':sensorId/datastream/:dataStreamId')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove sensor dataStream' })
  @ApiResponse({ status: 200, description: 'Datastream removed from sensor' })
  @ApiResponse({ status: 400, description: 'Datastream removal failed' })
  async removeSensorDatastream(@Req() req: Request, @Param() params: DataStreamIdParams): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new DeleteDatastreamCommand(params.sensorId, user.organizationId,
        params.dataStreamId));
  }

  @Delete(':sensorId')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove sensor' })
  @ApiResponse({ status: 200, description: 'Sensor removed' })
  @ApiResponse({ status: 400, description: 'Sensor removal failed' })
  async removeSensor(@Req() req: Request, @Param() params: SensorIdParams): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new DeleteSensorCommand(params.sensorId, user.organizationId));
  }
}
