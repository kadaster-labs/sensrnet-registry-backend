import { ICommand } from '@nestjs/cqrs';
import ObservationGoal from '../../interfaces/observation-goal.interface';

export abstract class AbstractObservationGoalCommand implements ICommand {

    public readonly observationGoalId: string;
    public readonly name: string;
    public readonly description: string;
    public readonly legalGround: string;
    public readonly legalGroundLink: string;

    constructor(
        public readonly legalEntityId: string,
        observationGoal: ObservationGoal,
        ) {
        this.observationGoalId = observationGoal.observationGoalId;
        this.name = observationGoal.name;
        this.description = observationGoal.description;
        this.legalGround = observationGoal.legalGround;
        this.legalGroundLink = observationGoal.legalGroundLink;
    }

}
