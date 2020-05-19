import { v4 as uuidv4 } from 'uuid';
import { config } from '../../../config';
import { SensorIdDto } from '../dtos/sensor.dto';
import { SensorService } from '../services/sensor.service';
import { UpdateSensorDto } from '../dtos/update-sensor.dto';
import { RegisterSensorDto } from '../dtos/register-sensor.dto';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Post, Param, Body, Delete, Put } from '@nestjs/common';


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

  @ApiOperation({ title: 'Update Sensor' })
  @ApiResponse({ status: 200, description: 'Update Sensor.' })
  @Put(':id')
  async updateSensor(@Param() id: SensorIdDto, @Body() sensorDto: UpdateSensorDto) {
    return this.sensorsService.updateSensor({...id, ...sensorDto});
  }

  @ApiOperation({ title: 'Remove Sensor' })
  @ApiResponse({ status: 200, description: 'Remove Sensor.' })
  @Delete(':id')
  async removeSensor(@Param() id: SensorIdDto) {
    return this.sensorsService.removeSensor(id);
  }
}
