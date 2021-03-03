import { ICommand } from '@nestjs/cqrs';

export class UpdateObservationGoalCommand implements ICommand {
    constructor(
        public readonly deviceId: string,
        public readonly dataStreamId: string,
        public readonly observationGoalId: string,
        public readonly legalEntityId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly legalGround: string,
        public readonly legalGroundLink: string,
    ) {}
}
