import { ICommand } from '@nestjs/cqrs';

export class UpdateSensorCommand implements ICommand {
  constructor(
      public readonly sensorId: string,
      public readonly legalEntityId: string,
      public readonly deviceId: string,
      public readonly name: string,
      public readonly description: string,
      public readonly supplier: string,
      public readonly manufacturer: string,
      public readonly documentationUrl: string,
      public readonly active: boolean,
    ) {}
}
