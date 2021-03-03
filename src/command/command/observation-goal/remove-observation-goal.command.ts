import { ICommand } from '@nestjs/cqrs';

export class RemoveObservationGoalCommand implements ICommand {
  constructor(
      public readonly deviceId: string,
      public readonly dataStreamId: string,
      public readonly observationGoalId: string,
      public readonly legalEntityId: string,
    ) {}
}
