import { ICommand } from '@nestjs/cqrs';

export class UpdateSensorCommand implements ICommand {
  constructor(
    public readonly sensorId: string,
    public readonly organizationId: string,
    public readonly name: string,
    public readonly aim: string,
    public readonly description: string,
    public readonly manufacturer: string,
    public readonly observationArea: Record<string, any>,
    public readonly documentationUrl: string,
    public readonly theme: string[],
    public readonly category: string,
    public readonly typeName: string,
    public readonly typeDetails: Record<string, any>,
    ) {}
}
