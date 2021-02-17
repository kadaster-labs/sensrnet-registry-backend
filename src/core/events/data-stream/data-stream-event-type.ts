import { AbstractEventType } from '../abstract-event-type';
import { DatastreamAdded, getDatastreamAddedEvent } from './added';
import { DatastreamUpdated, getDatastreamUpdatedEvent } from './updated';
import { DatastreamDeleted, getDatastreamDeletedEvent } from './deleted';

class DataStreamEventType extends AbstractEventType {
  constructor() {
    super();

    this.add(DatastreamAdded, getDatastreamAddedEvent);
    this.add(DatastreamUpdated, getDatastreamUpdatedEvent);
    this.add(DatastreamDeleted, getDatastreamDeletedEvent);
  }
}

export const dataStreamEventType = new DataStreamEventType();
