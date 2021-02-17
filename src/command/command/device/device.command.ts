import { ICommand } from '@nestjs/cqrs';

export class DeviceCommand implements ICommand {
  constructor(
      public readonly deviceId: string,
      public readonly legalEntityId: string,
      public readonly description: string,
      public readonly connectivity: string,
      public readonly location: number[],
  ) {}
}
