import { ICommand } from '@nestjs/cqrs';

export class ShareSensorOwnershipCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
    public readonly organizationId: string,
    public readonly newOrganizationId: string,
    ) {}
}
