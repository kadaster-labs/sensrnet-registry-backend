import { RemoveSensorHandler } from './remove-sensor.handler';
import { RegisterSensorHandler } from './register-sensor.handler';
import { UpdateSensorHandler, UpdateSensorOwnerHandler } from './update-sensor.handler';


export const CommandHandlers = [
  RegisterSensorHandler,
  UpdateSensorHandler,
  UpdateSensorOwnerHandler,
  RemoveSensorHandler,
];
