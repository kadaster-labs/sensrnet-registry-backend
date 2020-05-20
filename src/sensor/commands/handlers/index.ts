import { RemoveSensorHandler } from './remove-sensor.handler';
import { RegisterSensorHandler } from './register-sensor.handler';
import { UpdateSensorDetailsHandler, TransferSensorOwnershipHandler,
  ShareSensorOwnershipHandler, ActivateSensorHandler,
  DeactivateSensorHandler, AddDataStreamHandler, 
  RemoveDataStreamHandler, UpdateSensorLocationHandler } from './update-sensor.handler';


export const CommandHandlers = [
  RemoveSensorHandler,
  AddDataStreamHandler,
  RegisterSensorHandler,
  ActivateSensorHandler,
  RemoveDataStreamHandler,
  DeactivateSensorHandler,
  UpdateSensorDetailsHandler,
  UpdateSensorLocationHandler,
  ShareSensorOwnershipHandler,
  TransferSensorOwnershipHandler,
];
