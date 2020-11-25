import { ICommand } from '@nestjs/cqrs';

export class TransferSensorOwnershipCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
    public readonly oldOrganizationId: string,
    public readonly newOrganizationId: string,
    ) {}
}
