import { v4 as uuidv4 } from 'uuid';
import { CommandBus } from '@nestjs/cqrs';
import { LocationBody } from './model/location.body';
import { UpdateSensorBody } from './model/update-sensor.body';
import { CreateSensorCommand } from '../model/create-sensor.command';
import { UpdateSensorCommand } from '../model/update-sensor.command';
import { DeleteSensorCommand } from '../model/delete-sensor.command';
import { DatastreamBody } from './model/datastream.body';
import { RegisterSensorBody } from './model/register-sensor.body';
import { ActivateSensorCommand } from '../model/activate-sensor.command';
import { AccessJwtAuthGuard } from '../../auth/access-jwt-auth.guard';
import { DeactivateSensorCommand } from '../model/deactivate-sensor.command';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ShareOwnershipBody } from './model/share-ownership.body';
import { CreateDatastreamCommand } from '../model/create-datastream.command';
import { DeleteDatastreamCommand } from '../model/delete-datastream.command';
import { TransferOwnershipBody } from './model/transfer-ownership.body';
import { SensorIdParams, DataStreamIdParams } from './model/id.params';
import { ShareSensorOwnershipCommand } from '../model/share-sensor-ownership.command';
import { UpdateSensorLocationCommand } from '../model/update-sensor-location.command';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransferSensorOwnershipCommand } from '../model/transfer-sensor-ownership.command';
import { Controller, Param, Post, Put, Body, Delete, UseFilters, Request, UseGuards } from '@nestjs/common';

@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@ApiTags('Sensor')
@Controller('Sensor')
export class SensorController {
  constructor(private readonly commandBus: CommandBus) { }

  @Post()
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Register sensor' })
  @ApiResponse({ status: 200, description: 'Sensor registered' })
  @ApiResponse({ status: 400, description: 'Sensor registration failed' })
  async registerOwner(@Body() sensorBody: RegisterSensorBody, @Request() req) {
    const sensorId = uuidv4();
    for (const dataStream of sensorBody.dataStreams) {
      dataStream.dataStreamId = uuidv4();
    }

    await this.commandBus.execute(new CreateSensorCommand(sensorId,
        req.user.ownerId, sensorBody.name, sensorBody.location,
        sensorBody.dataStreams, sensorBody.aim, sensorBody.description,
        sensorBody.manufacturer, sensorBody.active, sensorBody.observationArea,
        sensorBody.documentationUrl, sensorBody.theme, sensorBody.typeName,
        sensorBody.typeDetails));

    return { sensorId };
  }

  @Put(':sensorId/details')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update sensor details' })
  @ApiResponse({ status: 200, description: 'Sensor updated' })
  @ApiResponse({ status: 400, description: 'Sensor update failed' })
  async updateSensorDetails(@Param() params: SensorIdParams, @Body() sensorBody: UpdateSensorBody) {
    return await this.commandBus.execute(new UpdateSensorCommand(params.sensorId,
      sensorBody.name, sensorBody.aim, sensorBody.description,
      sensorBody.manufacturer, sensorBody.observationArea, sensorBody.documentationUrl,
      sensorBody.theme, sensorBody.typeName, sensorBody.typeDetails));
  }

  @Put(':sensorId/transfer')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Transfer sensor ownership' })
  @ApiResponse({ status: 200, description: 'Sensor ownership transferred' })
  @ApiResponse({ status: 400, description: 'Sensor ownership transfer failed' })
  async transferSensorOwnership(@Param() params: SensorIdParams, @Body() transferOwnershipBody: TransferOwnershipBody,
                                @Request() req) {
    return await this.commandBus.execute(new TransferSensorOwnershipCommand(params.sensorId,
        req.user.ownerId, transferOwnershipBody.newOwnerId));
  }

  @Put(':sensorId/share')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Share sensor ownership' })
  @ApiResponse({ status: 200, description: 'Sensor ownership shared' })
  @ApiResponse({ status: 400, description: 'Sensor ownership sharing failed' })
  async shareSensorOwnership(@Param() params: SensorIdParams, @Body() shareOwnershipBody: ShareOwnershipBody) {
    const uniqueOwnerIds = shareOwnershipBody.ownerIds ? [...new Set(shareOwnershipBody.ownerIds)] : undefined;
    return await this.commandBus.execute(new ShareSensorOwnershipCommand(params.sensorId, uniqueOwnerIds));
  }

  @Put(':sensorId/location')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update sensor location' })
  @ApiResponse({ status: 200, description: 'Sensor location updated' })
  @ApiResponse({ status: 400, description: 'Sensor location update failed' })
  async relocateSensor(@Param() params: SensorIdParams, @Body() locationBody: LocationBody) {
    return await this.commandBus.execute(new UpdateSensorLocationCommand(params.sensorId,
      locationBody.longitude, locationBody.latitude, locationBody.height, locationBody.baseObjectId));
  }

  @Put(':sensorId/activate')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Activate sensor' })
  @ApiResponse({ status: 200, description: 'Sensor activated' })
  @ApiResponse({ status: 400, description: 'Sensor activation failed' })
  async activateSensor(@Param() params: SensorIdParams) {
    return await this.commandBus.execute(new ActivateSensorCommand(params.sensorId));
  }

  @Put(':sensorId/deactivate')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Deactivate sensor' })
  @ApiResponse({ status: 200, description: 'Sensor deactivated' })
  @ApiResponse({ status: 400, description: 'Sensor deactivation failed' })
  async deactivateSensor(@Param() params: SensorIdParams) {
    return await this.commandBus.execute(new DeactivateSensorCommand(params.sensorId));
  }

  @Post(':sensorId/create/datastream')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Add sensor dataStream' })
  @ApiResponse({ status: 200, description: 'Datastream added to sensor' })
  @ApiResponse({ status: 400, description: 'Datastream addition failed' })
  async addSensorDatastream(@Param() params: SensorIdParams, @Body() dataStreamBody: DatastreamBody) {
    const dataStreamId = uuidv4();
    return await this.commandBus.execute(new CreateDatastreamCommand(params.sensorId, dataStreamId,
      dataStreamBody.name, dataStreamBody.reason, dataStreamBody.description, dataStreamBody.observedProperty,
      dataStreamBody.unitOfMeasurement, dataStreamBody.isPublic, dataStreamBody.isOpenData,
      dataStreamBody.isReusable, dataStreamBody.documentationUrl, dataStreamBody.dataLink,
      dataStreamBody.dataFrequency, dataStreamBody.dataQuality));
  }

  @Delete(':sensorId/delete/datastream/:dataStreamId')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove sensor dataStream' })
  @ApiResponse({ status: 200, description: 'Datastream removed from sensor' })
  @ApiResponse({ status: 400, description: 'Datastream removal failed' })
  async removeSensorDatastream(@Param() params: DataStreamIdParams) {
    return await this.commandBus.execute(new DeleteDatastreamCommand(params.sensorId, params.dataStreamId));
  }

  @Delete(':sensorId')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove sensor' })
  @ApiResponse({ status: 200, description: 'Sensor removed' })
  @ApiResponse({ status: 400, description: 'Sensor removal failed' })
  async removeOwner(@Param() params: SensorIdParams) {
    return await this.commandBus.execute(new DeleteSensorCommand(params.sensorId));
  }

}
