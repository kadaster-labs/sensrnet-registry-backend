import { ICommand } from '@nestjs/cqrs';
import { UpdateSensorDetailsDto, TransferSensorOwnershipDto,
  ShareSensorOwnershipDto } from '../../dtos/update-sensor.dto';
import { SensorIdDto, LocationDto, DataStreamDto } from '../../dtos/sensor.dto';


export class UpdateSensorDetailsCommand implements ICommand {
  constructor(
    public readonly dto: UpdateSensorDetailsDto,
  ) {}
}

export class TransferSensorOwnershipCommand implements ICommand {
  constructor(
    public readonly dto: TransferSensorOwnershipDto,
  ) {}
}

export class ShareSensorOwnershipCommand implements ICommand {
  constructor(
    public readonly dto: ShareSensorOwnershipDto,
  ) {}
}

export class UpdateSensorLocationCommand implements ICommand {
  constructor(
    public readonly dto: LocationDto,
  ) {}
}

export class ActivateSensorCommand implements ICommand {
  constructor(
    public readonly dto: SensorIdDto,
  ) {}
}

export class DeactivateSensorCommand implements ICommand {
  constructor(
    public readonly dto: SensorIdDto,
  ) {}
}

export class AddDataStreamCommand implements ICommand {
  constructor(
    public readonly dto: DataStreamDto,
  ) {}
}

export class RemoveDataStreamCommand implements ICommand {
  constructor(
    public readonly dto: DataStreamDto,
  ) {}
}
