import { v4 as uuidv4 } from 'uuid';
import { CommandBus } from "@nestjs/cqrs";
import { SensorIdParams, DataStreamIdParams } from "./models/params/id-params";
import { CreateSensorBody } from "./models/bodies/create-body";
import { UpdateSensorBody } from "./models/bodies/update-body";
import { LocationBody } from "./models/bodies/location-body";
import { ActivateSensorCommand } from './commands/activate.command';
import { CreateSensorCommand } from "./commands/create.command";
import { UpdateSensorCommand } from "./commands/update.command";
import { DeleteSensorCommand } from "./commands/delete.command";
import { DataStreamBody } from "./models/bodies/datastream-body";
import { DeactivateSensorCommand } from './commands/deactivate.command';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { DomainExceptionFilter } from "./errors/domain-exception.filter"
import { ShareOwnershipBody } from "./models/bodies/shareownership-body";
import { ShareSensorOwnershipCommand } from "./commands/shareownership.command";
import { UpdateSensorLocationCommand } from './commands/updatelocation.command';
import { CreateDataStreamCommand } from "./commands/createdatastream.command";
import { DeleteDataStreamCommand } from "./commands/deletedatastream.command";
import { TransferOwnershipBody } from "./models/bodies/transferownership-body";
import { TransferSensorOwnershipCommand } from "./commands/transferownership.command";
import { Controller, Param, Post,  Put, Body, Delete, UseFilters } from "@nestjs/common";

const NODE_ID = process.env.NODE_ID || '1';


@ApiTags('Sensor')
@Controller("Sensor")
export class OwnerController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Register sensor' })
  @ApiResponse({ status: 200, description: 'Sensor registered' })
  @ApiResponse({ status: 400, description: 'Sensor registration failed' })
  async createOwner(@Body() sensorBody: CreateSensorBody) {
    const sensorId = uuidv4();
    for (const dataStream of sensorBody.dataStreams) {
      dataStream.id = uuidv4();
    }

    await this.commandBus.execute(new CreateSensorCommand(sensorId, NODE_ID,
      sensorBody.ownerIds, sensorBody.name, sensorBody.location,
      sensorBody.dataStreams, sensorBody.aim, sensorBody.description, 
      sensorBody.manufacturer, sensorBody.active, sensorBody.observationArea, 
      sensorBody.documentationUrl, sensorBody.category, sensorBody.theme, 
      sensorBody.typeName, sensorBody.typeDetails));
  }

  @Put(':id/details')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update sensor details' })
  @ApiResponse({ status: 200, description: 'Sensor updated' })
  @ApiResponse({ status: 400, description: 'Sensor update failed' })
  async updateSensorDetails(@Param() params: SensorIdParams, @Body() sensorBody: UpdateSensorBody) {
    return await this.commandBus.execute(new UpdateSensorCommand(params.id, 
      sensorBody.name, sensorBody.aim, sensorBody.description, 
      sensorBody.manufacturer, sensorBody.observationArea, sensorBody.documentationUrl, 
      sensorBody.category, sensorBody.theme, sensorBody.typeName, sensorBody.typeDetails));
  }

  @Put(':id/transfer')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Transfer sensor ownership' })
  @ApiResponse({ status: 200, description: 'Sensor ownership transferred' })
  @ApiResponse({ status: 400, description: 'Sensor ownership transfer failed' })
  async transferSensorOwnership(@Param() params: SensorIdParams, @Body() transferOwnershipBody: TransferOwnershipBody) {
    return await this.commandBus.execute(new TransferSensorOwnershipCommand(params.id,
      transferOwnershipBody.oldOwnerId, transferOwnershipBody.newOwnerId));
  }

  @Put(':id/share')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Share sensor ownership' })
  @ApiResponse({ status: 200, description: 'Sensor ownership shared' })
  @ApiResponse({ status: 400, description: 'Sensor ownership sharing failed' })
  async shareSensorOwnership(@Param() params: SensorIdParams, @Body() shareOwnershipBody: ShareOwnershipBody) {
    return await this.commandBus.execute(new ShareSensorOwnershipCommand(params.id, 
      shareOwnershipBody.ownerId));
  }

  @Put(':id/location')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update sensor location' })
  @ApiResponse({ status: 200, description: 'Sensor location updated' })
  @ApiResponse({ status: 400, description: 'Sensor location update failed' })
  async updateSensorLocation(@Param() params: SensorIdParams, @Body() locationBody: LocationBody) {
    return await this.commandBus.execute(new UpdateSensorLocationCommand(params.id, 
      locationBody.x, locationBody.y, locationBody.z, locationBody.epsgCode, locationBody.baseObjectId));
  }

  @Put(':id/activate')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Activate sensor' })
  @ApiResponse({ status: 200, description: 'Sensor activated' })
  @ApiResponse({ status: 400, description: 'Sensor activation failed' })
  async activateSensor(@Param() params: SensorIdParams) {
    return await this.commandBus.execute(new ActivateSensorCommand(params.id));
  }

  @Put(':id/deactivate')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Deactivate sensor' })
  @ApiResponse({ status: 200, description: 'Sensor deactivated' })
  @ApiResponse({ status: 400, description: 'Sensor deactivation failed' })
  async deActivateSensor(@Param() params: SensorIdParams) {
    return await this.commandBus.execute(new DeactivateSensorCommand(params.id));
  }

  @Post(':id/create/datastream')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Add sensor dataStream' })
  @ApiResponse({ status: 200, description: 'Datastream added to sensor' })
  @ApiResponse({ status: 400, description: 'Datastream addition failed' })
  async addSensorDataStream(@Param() params: SensorIdParams, @Body() dataStreamBody: DataStreamBody) {
    const dataStreamId = uuidv4();
    return await this.commandBus.execute(new CreateDataStreamCommand(params.id, dataStreamId, 
      dataStreamBody.name, dataStreamBody.description, dataStreamBody.unitOfMeasurement, dataStreamBody.isPublic, 
      dataStreamBody.isOpenData, dataStreamBody.isReusable, dataStreamBody.documentationUrl,
      dataStreamBody.dataLink, dataStreamBody.dataFrequency, dataStreamBody.dataQuality));
  }

  @Delete(':id/delete/datastream/:dataStreamId')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove sensor dataStream' })
  @ApiResponse({ status: 200, description: 'Datastream removed from sensor' })
  @ApiResponse({ status: 400, description: 'Datastream removal failed' })
  async removeSensorDataStream(@Param() params: DataStreamIdParams) {
    return await this.commandBus.execute(new DeleteDataStreamCommand(params.id, params.dataStreamId));
  }

  @Delete(':id')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove sensor' })
  @ApiResponse({ status: 200, description: 'Sensor removed' })
  @ApiResponse({ status: 400, description: 'Sensor removal failed' })
  async removeOwner(@Param() params: SensorIdParams) {
    return await this.commandBus.execute(new DeleteSensorCommand(params.id));
  }
}
