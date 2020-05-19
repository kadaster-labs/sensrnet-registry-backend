import { SensorRegisteredHandler} from './sensor-registered.handler';
import { SensorUpdatedHandler} from './sensor-updated.handler';
import { SensorRemovedHandler} from './sensor-removed.handler';


export const EventHandlers = [
  SensorRegisteredHandler,
  SensorUpdatedHandler,
  SensorRemovedHandler,
];
