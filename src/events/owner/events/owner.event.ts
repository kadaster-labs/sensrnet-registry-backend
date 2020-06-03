import {Event} from '../../../event-store/event';

export abstract class OwnerEvent extends Event {

  streamRoot(): string {
    return 'owner';
  }

}
