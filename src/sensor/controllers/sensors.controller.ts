import { Controller, Get, Post, Param, Body, Delete, Put } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { SensorIdRequestParamsDto } from '../dtos/sensors.dto';
import { SensorDto } from '../dtos/sensors.dto';
import { SensorsService } from '../services/sensors.service';
import { v4 as uuidv4 } from 'uuid';


@Controller('sensors')
@ApiUseTags('Sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) { }

  /* Create Sensor */
  /*--------------------------------------------*/
  @ApiOperation({ title: 'Create Sensor' })
  @ApiResponse({ status: 200, description: 'Create Sensor.' })
  @Post()
  async createSensor(@Body() sensorDto: SensorDto): Promise<SensorDto> {
    const sensorId = uuidv4();
    return this.sensorsService.createSensor({...{sensorId}, ...sensorDto});
  }

  /* Update Sensor */
  /*--------------------------------------------*/
  @ApiOperation({ title: 'Update Sensor' })
  @ApiResponse({ status: 200, description: 'Update Sensor.' })
  @Put(':sensorId')
  async updateSensor(@Param() sensorId: SensorIdRequestParamsDto, @Body() sensorDto: SensorDto) {
    return this.sensorsService.updateSensor({...sensorId, ...sensorDto});
  }

  /* Delete Sensor */
  /*--------------------------------------------*/
  @ApiOperation({ title: 'Delete Sensor' })
  @ApiResponse({ status: 200, description: 'Delete Sensor.' })
  @Delete(':sensorId')
  async deleteSensor(@Param() sensorId: SensorIdRequestParamsDto) {
    return this.sensorsService.deleteSensor(sensorId);
  }

  /* TODO: List Sensors */
  /*--------------------------------------------*/
  @ApiOperation({ title: 'List Sensors' })
  @ApiResponse({ status: 200, description: 'List Sensors.' })
  @Get()
  async findSensors(@Param() param) {
    return this.sensorsService.findSensor();
  }

  /* TODO: Find Sensor */
  /*--------------------------------------------*/
  @ApiOperation({ title: 'Get Sensor' })
  @ApiResponse({ status: 200, description: 'Get Sensor.' })
  @Get(':sensorId')
  async findOneSensor(@Param() sensorId: SensorIdRequestParamsDto) {
    return this.sensorsService.findSensor();
  }
}
