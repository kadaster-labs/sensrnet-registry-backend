import { Injectable } from '@nestjs/common';
import { Sensor } from '../models/sensor.model';

@Injectable()
export class SensorRepository {
  async createSensor(sensorDto) {
    const sensor = new Sensor(undefined);
    sensor.setData(sensorDto);
    sensor.createSensor();
    return sensor;
  }

  async updateSensor(sensorDto) {
    const sensor = new Sensor(sensorDto.sensorId);
    sensor.setData(sensorDto);
    sensor.updateSensor();
    return sensor;
  }

  async deleteSensor(sensorDto) {
    const sensor = new Sensor(sensorDto.sensorId);
    sensor.deleteSensor();
    return sensor;
  }

  async welcomeSensor(sensorDto) {
    const sensor = new Sensor(sensorDto.sensorId);
    sensor.welcomeSensor();
    return sensor;
  }
}
