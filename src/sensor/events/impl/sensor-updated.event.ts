import { IEvent } from '@nestjs/cqrs';
import { LocationDto, DataStreamDto } from 'sensor/dtos/sensor.dto';
import { UpdateSensorDetailsDto, TransferSensorOwnershipDto,
  ShareSensorOwnershipDto } from '../../dtos/update-sensor.dto';


export class SensorDetailsUpdatedEvent implements IEvent {
  constructor(
    public readonly dto: UpdateSensorDetailsDto) {}
}

export class SensorOwnershipTransferredEvent implements IEvent {
  constructor(
    public readonly dto: TransferSensorOwnershipDto) {}
}

export class SensorOwnershipSharedEvent implements IEvent {
  constructor(
    public readonly dto: ShareSensorOwnershipDto) {}
}

export class SensorLocationUpdatedEvent implements IEvent {
  constructor(
    public readonly dto: LocationDto) {}
}

export class SensorActivatedEvent implements IEvent {
  constructor(
    public readonly id: string) {}
}

export class SensorDeactivatedEvent implements IEvent {
  constructor(
    public readonly id: string) {}
}

export class DataStreamAddedEvent implements IEvent {
  constructor(
    public readonly dto: DataStreamDto) {}
}

export class DataStreamRemovedEvent implements IEvent {
  constructor(
    public readonly dto: DataStreamDto) {}
}
