import { ICommand } from '@nestjs/cqrs';

export class RemoveDeviceCommand implements ICommand {
  constructor(
    public readonly deviceId: string,
    public readonly legalEntityId: string,
    ) {}
}
