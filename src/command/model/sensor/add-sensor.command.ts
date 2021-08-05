import { ICommand } from '@nestjs/cqrs';

export class AddSensorCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
    public readonly legalEntityId: string,
    public readonly deviceId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly type: string,
    public readonly manufacturer: string,
    public readonly supplier: string,
    public readonly documentation: string,
    ) {}
}
