import { ICommand } from '@nestjs/cqrs';

export class UpdateSensorLocationCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
    public readonly organizationId: string,
    public readonly location: number[],
    public readonly baseObjectId: string,
    ) {}
}
