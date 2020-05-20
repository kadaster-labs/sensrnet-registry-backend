import { Injectable } from '@nestjs/common';
import { Sensor, DataStream } from '../models/sensor.model';


@Injectable()
export class SensorRepository {
  async registerSensor(sensorDto) {
    const sensor = new Sensor(undefined);
    sensor.setData(sensorDto);
    sensor.registerSensor();
    return sensor;
  }

  async updateSensorDetails(sensorDto) {
    const sensor = new Sensor(sensorDto.id);
    sensor.setData(sensorDto);
    sensor.updateSensorDetails();
    return sensor;
  }

  async transferSensorOwnership(sensorDto) {
    const sensor = new Sensor(sensorDto.id);
    sensor.setData(sensorDto);
    sensor.transferSensorOwnership();
    return sensor;
  }

  async shareSensorOwnership(sensorDto) {
    const sensor = new Sensor(sensorDto.id);
    sensor.setData(sensorDto);
    sensor.shareSensorOwnership();
    return sensor;
  }

  async updateSensorLocation(sensorDto) {
    const sensor = new Sensor(sensorDto.id);
    sensor.setData(sensorDto);
    sensor.updateSensorLocation();
    return sensor;
  }

  async activateSensor(sensorDto) {
    const sensor = new Sensor(sensorDto.id);
    sensor.activateSensor();
    return sensor;
  }

  async deactivateSensor(sensorDto) {
    const sensor = new Sensor(sensorDto.id);
    sensor.deactivateSensor();
    return sensor;
  }

  async addDataStream(dataStreamDto) {
    const dataStream = new DataStream(dataStreamDto.id);
    dataStream.setData(dataStreamDto);
    dataStream.addDataStream();
    return dataStream;
  }

  async removeDataStream(dataStreamDto) {
    const dataStream = new DataStream(dataStreamDto.id);
    dataStream.setData(dataStreamDto);
    dataStream.removeDataStream();
    return dataStream;
  }

  async removeSensor(sensorDto) {
    const sensor = new Sensor(sensorDto.id);
    sensor.removeSensor();
    return sensor;
  }
}
