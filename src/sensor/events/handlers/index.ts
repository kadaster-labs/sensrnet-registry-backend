import { SensorCreatedHandler} from './sensor-registered.handler';
import { SensorUpdatedHandler} from './sensor-updated.handler';
import { SensorDeletedHandler} from './sensor-deleted.handler';
import { SensorWelcomedHandler} from './sensor-welcomed.handler';

export const EventHandlers = [
  SensorCreatedHandler,
  SensorUpdatedHandler,
  SensorDeletedHandler,
  SensorWelcomedHandler,
];
