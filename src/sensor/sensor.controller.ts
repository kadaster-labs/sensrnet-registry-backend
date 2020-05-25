import { v4 as uuidv4 } from 'uuid';
import { CommandBus } from "@nestjs/cqrs";
import { IdParams } from "./models/params/id-params";
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
  @ApiOperation({ summary: 'Register Sensor' })
  @ApiResponse({ status: 200, description: 'Register Sensor.' })
  async createOwner(@Body() sensorBody: CreateSensorBody) {
    const id = uuidv4();
    await this.commandBus.execute(new CreateSensorCommand(id, NODE_ID, sensorBody.ownerIds, 
      sensorBody.location, sensorBody.legalBase, sensorBody.active, sensorBody.typeName, 
      sensorBody.typeDetails, sensorBody.dataStreams));
  }

  @Put(':id/details')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update Sensor Details' })
  @ApiResponse({ status: 200, description: 'Update Sensor Details.' })
  async updateSensorDetails(@Param() params: IdParams, @Body() sensorBody: UpdateSensorBody) {
    return await this.commandBus.execute(new UpdateSensorCommand(params.id, sensorBody.legalBase, 
      sensorBody.typeName, sensorBody.typeDetails));
  }

  @Put(':id/transfer')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Transfer Sensor Ownership' })
  @ApiResponse({ status: 200, description: 'Transfer Sensor Ownership.' })
  async transferSensorOwnership(@Param() params: IdParams, @Body() transferOwnershipBody: TransferOwnershipBody) {
    return await this.commandBus.execute(new TransferSensorOwnershipCommand(params.id,
      transferOwnershipBody.oldOwnerId, transferOwnershipBody.newOwnerId));
  }

  @Put(':id/share')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Share Sensor Ownership' })
  @ApiResponse({ status: 200, description: 'Share Sensor Ownership.' })
  async shareSensorOwnership(@Param() params: IdParams, @Body() shareOwnershipBody: ShareOwnershipBody) {
    return await this.commandBus.execute(new ShareSensorOwnershipCommand(params.id, 
      shareOwnershipBody.ownerId));
  }

  @Put(':id/location')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update Sensor Location' })
  @ApiResponse({ status: 200, description: 'Update Sensor Location.' })
  async updateSensorLocation(@Param() params: IdParams, @Body() locationBody: LocationBody) {
    return await this.commandBus.execute(new UpdateSensorLocationCommand(params.id, 
      locationBody.lat, locationBody.lon, locationBody.height, locationBody.baseObjectId));
  }

  @Put(':id/activate')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Activate Sensor' })
  @ApiResponse({ status: 200, description: 'Activate Sensor.' })
  async activateSensor(@Param() params: IdParams) {
    return await this.commandBus.execute(new ActivateSensorCommand(params.id));
  }

  @Put(':id/deactivate')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Deactivate Sensor' })
  @ApiResponse({ status: 200, description: 'Deactivate Sensor.' })
  async deActivateSensor(@Param() params: IdParams) {
    return await this.commandBus.execute(new DeactivateSensorCommand(params.id));
  }

  @Post(':id/create/datastream')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Add Sensor DataStream' })
  @ApiResponse({ status: 200, description: 'Add Sensor DataStream.' })
  async addSensorDataStream(@Param() params: IdParams, @Body() dataStreamBody: DataStreamBody) {
    return await this.commandBus.execute(new CreateDataStreamCommand(params.id, dataStreamBody.name));
  }

  @Delete(':id/delete/datastream')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove Sensor DataStream' })
  @ApiResponse({ status: 200, description: 'Remove Sensor DataStream.' })
  async removeSensorDataStream(@Param() params: IdParams, @Body() dataStreamBody: DataStreamBody) {
    return await this.commandBus.execute(new DeleteDataStreamCommand(params.id, dataStreamBody.name));
  }

  @Delete(':id')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove Sensor' })
  @ApiResponse({ status: 200, description: 'Remove Sensor.' })
  async removeOwner(@Param() params: IdParams) {
    return await this.commandBus.execute(new DeleteSensorCommand(params.id));
  }
}
