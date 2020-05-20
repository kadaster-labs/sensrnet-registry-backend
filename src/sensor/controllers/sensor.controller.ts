import { v4 as uuidv4 } from 'uuid';
import { config } from '../../../config';
import { SensorService } from '../services/sensor.service';
import { RegisterSensorDto } from '../dtos/register-sensor.dto';
import { SensorIdDto, LocationDto, DataStreamDto } from '../dtos/sensor.dto';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Post, Param, Body, Delete, Put } from '@nestjs/common';
import { UpdateSensorDetailsDto, TransferSensorOwnershipDto,
  ShareSensorOwnershipDto } from '../dtos/update-sensor.dto';


@Controller('sensor')
@ApiUseTags('Sensor')
export class SensorController {
  constructor(private readonly sensorsService: SensorService) {}

  @ApiOperation({ title: 'Register Sensor' })
  @ApiResponse({ status: 200, description: 'Register Sensor.' })
  @Post()
  async createSensor(@Body() sensorDto: RegisterSensorDto): Promise<RegisterSensorDto> {
    const id = uuidv4();
    const nodeId = config.NODE_ID;
    return this.sensorsService.registerSensor({...{id, nodeId}, ...sensorDto});
  }

  @ApiOperation({ title: 'Update Sensor Details' })
  @ApiResponse({ status: 200, description: 'Update Sensor Details.' })
  @Put(':id/details')
  async updateSensorDetails(@Param() id: SensorIdDto, @Body() sensorDto: UpdateSensorDetailsDto) {
    return this.sensorsService.updateSensorDetails({...id, ...sensorDto});
  }

  @ApiOperation({ title: 'Transfer Sensor Ownership' })
  @ApiResponse({ status: 200, description: 'Transfer Sensor Ownership.' })
  @Put(':id/transfer')
  async transferSensorOwnership(@Param() id: SensorIdDto, @Body() sensorDto: TransferSensorOwnershipDto) {
    return this.sensorsService.transferSensorOwnership({...id, ...sensorDto});
  }

  @ApiOperation({ title: 'Share Sensor Ownership' })
  @ApiResponse({ status: 200, description: 'Share Sensor Ownership.' })
  @Put(':id/share')
  async shareSensorOwnership(@Param() id: SensorIdDto, @Body() sensorDto: ShareSensorOwnershipDto) {
    return this.sensorsService.shareSensorOwnership({...id, ...sensorDto});
  }

  @ApiOperation({ title: 'Update Sensor Location' })
  @ApiResponse({ status: 200, description: 'Update Sensor Location.' })
  @Put(':id/location')
  async updateSensorLocation(@Param() id: SensorIdDto, @Body() sensorDto: LocationDto) {
    return this.sensorsService.updateSensorLocation({...id, ...sensorDto});
  }

  @ApiOperation({ title: 'Activate Sensor' })
  @ApiResponse({ status: 200, description: 'Activate Sensor.' })
  @Put(':id/activate')
  async activateSensor(@Param() id: SensorIdDto) {
    return this.sensorsService.activateSensor(id);
  }

  @ApiOperation({ title: 'Deactivate Sensor' })
  @ApiResponse({ status: 200, description: 'Deactivate Sensor.' })
  @Put(':id/deactivate')
  async deActivateSensor(@Param() id: SensorIdDto) {
    return this.sensorsService.deactivateSensor(id);
  }

  @ApiOperation({ title: 'Add Sensor DataStream' })
  @ApiResponse({ status: 200, description: 'Add Sensor DataStream.' })
  @Post(':id/create/datastream')
  async addSensorDataStream(@Param() id: SensorIdDto, @Body() dataStreamDto: DataStreamDto) {
    return this.sensorsService.addDataStream({...id, ...dataStreamDto});
  }

  @ApiOperation({ title: 'Remove Sensor DataStream' })
  @ApiResponse({ status: 200, description: 'Remove Sensor DataStream.' })
  @Delete(':id/delete/datastream')
  async removeSensorDataStream(@Param() id: SensorIdDto, @Body() dataStreamDto: DataStreamDto) {
    return this.sensorsService.removeDataStream({...id, ...dataStreamDto});
  }

  @ApiOperation({ title: 'Remove Sensor' })
  @ApiResponse({ status: 200, description: 'Remove Sensor.' })
  @Delete(':id')
  async removeSensor(@Param() id: SensorIdDto) {
    return this.sensorsService.removeSensor(id);
  }
}
