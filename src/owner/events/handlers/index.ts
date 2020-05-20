import { OwnerUpdatedHandler} from './owner-updated.handler';
import { OwnerRemovedHandler} from './owner-removed.handler';
import { OwnerRegisteredHandler} from './owner-registered.handler';


export const EventHandlers = [
  OwnerUpdatedHandler,
  OwnerRemovedHandler,
  OwnerRegisteredHandler
];
