import { Injectable } from '@nestjs/common';
import { Sensor } from '../models/sensor.model';


@Injectable()
export class SensorRepository {
  async registerSensor(sensorDto) {
    const sensor = new Sensor(undefined);
    sensor.setData(sensorDto);
    sensor.registerSensor();
    return sensor;
  }

  async updateSensor(sensorDto) {
    const sensor = new Sensor(sensorDto.id);
    sensor.setData(sensorDto);
    sensor.updateSensor();
    return sensor;
  }

  async updateSensorOwner(sensorDto) {
    const sensor = new Sensor(sensorDto.id);
    sensor.setData(sensorDto);
    sensor.updateSensorOwner();
    return sensor;
  }

  async removeSensor(sensorDto) {
    const sensor = new Sensor(sensorDto.id);
    sensor.removeSensor();
    return sensor;
  }
}
