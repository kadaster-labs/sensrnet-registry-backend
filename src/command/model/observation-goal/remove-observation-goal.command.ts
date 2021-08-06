import { ICommand } from '@nestjs/cqrs';

export class RemoveObservationGoalCommand implements ICommand {
    constructor(public readonly observationGoalId: string, public readonly legalEntityId: string) {}
}
