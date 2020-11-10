import { ICommand } from '@nestjs/cqrs';

export class UpdateSensorLocationCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
    public readonly organizationId: string,
    public readonly longitude: number,
    public readonly latitude: number,
    public readonly height: number,
    public readonly baseObjectId: string,
    ) {}
}
