import { Logger } from '@nestjs/common';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { SensorDetailsUpdatedEvent, SensorOwnershipTransferredEvent,
  SensorOwnershipSharedEvent, SensorActivatedEvent, 
  SensorDeactivatedEvent, DataStreamAddedEvent, 
  DataStreamRemovedEvent, SensorLocationUpdatedEvent } from '../impl/sensor-updated.event';


@EventsHandler(SensorDetailsUpdatedEvent)
export class SensorDetailsUpdatedHandler
  implements IEventHandler<SensorDetailsUpdatedEvent> {
  handle(event: SensorDetailsUpdatedEvent) {
    Logger.log(event, 'SensorDetailsUpdatedEvent');
  }
}

@EventsHandler(SensorOwnershipTransferredEvent)
export class SensorOwnershipTransferredHandler
  implements IEventHandler<SensorOwnershipTransferredEvent> {
  handle(event: SensorOwnershipTransferredEvent) {
    Logger.log(event, 'SensorOwnershipTransferredEvent');
  }
}

@EventsHandler(SensorOwnershipSharedEvent)
export class SensorOwnershipSharedHandler
  implements IEventHandler<SensorOwnershipSharedEvent> {
  handle(event: SensorOwnershipSharedEvent) {
    Logger.log(event, 'SensorOwnershipSharedEvent');
  }
}

@EventsHandler(SensorLocationUpdatedEvent)
export class SensorLocationUpdatedHandler
  implements IEventHandler<SensorLocationUpdatedEvent> {
  handle(event: SensorLocationUpdatedEvent) {
    Logger.log(event, 'SensorLocationUpdatedEvent');
  }
}

@EventsHandler(SensorActivatedEvent)
export class SensorActivatedHandler
  implements IEventHandler<SensorActivatedEvent> {
  handle(event: SensorActivatedEvent) {
    Logger.log(event, 'SensorActivatedEvent');
  }
}

@EventsHandler(SensorDeactivatedEvent)
export class SensorDeActivatedHandler
  implements IEventHandler<SensorDeactivatedEvent> {
  handle(event: SensorDeactivatedEvent) {
    Logger.log(event, 'SensorDeactivatedEvent');
  }
}

@EventsHandler(DataStreamAddedEvent)
export class DataStreamAddedHandler
  implements IEventHandler<DataStreamAddedEvent> {
  handle(event: DataStreamAddedEvent) {
    Logger.log(event, 'SensorDataStreamAddedEvent');
  }
}

@EventsHandler(DataStreamRemovedEvent)
export class DataStreamRemovedHandler
  implements IEventHandler<DataStreamRemovedEvent> {
  handle(event: DataStreamRemovedEvent) {
    Logger.log(event, 'SensorDataStreamRemovedEvent');
  }
}
