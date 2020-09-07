import {OwnerEvent} from './owner.event';

export class OwnerDeleted extends OwnerEvent {

  constructor(ownerId: string) {
    super(ownerId);
  }

}
