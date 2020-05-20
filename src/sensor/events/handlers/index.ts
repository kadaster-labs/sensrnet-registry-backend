import { SensorRemovedHandler} from './sensor-removed.handler';
import { SensorRegisteredHandler} from './sensor-registered.handler';
import { SensorDetailsUpdatedHandler, SensorOwnershipTransferredHandler,
  SensorOwnershipSharedHandler, SensorActivatedHandler,
  SensorDeActivatedHandler, DataStreamAddedHandler, 
  DataStreamRemovedHandler, SensorLocationUpdatedHandler } from './sensor-updated.handler';


export const EventHandlers = [
  SensorRemovedHandler,
  SensorActivatedHandler,
  DataStreamAddedHandler,
  SensorRegisteredHandler,
  SensorDeActivatedHandler,
  DataStreamRemovedHandler,
  SensorDetailsUpdatedHandler,
  SensorLocationUpdatedHandler,
  SensorOwnershipSharedHandler,
  SensorOwnershipTransferredHandler,
];
