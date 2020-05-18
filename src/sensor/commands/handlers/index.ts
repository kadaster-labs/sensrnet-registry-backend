import { CreateSensorHandler } from './create-sensor.handler';
import { DeleteSensorHandler } from './delete-sensor.handler';
import { UpdateSensorHandler } from './update-sensor.handler';
import { WelcomeSensorHandler } from './welcome-sensor.handler';

export const CommandHandlers = [
  CreateSensorHandler,
  DeleteSensorHandler,
  UpdateSensorHandler,
  WelcomeSensorHandler,
];
