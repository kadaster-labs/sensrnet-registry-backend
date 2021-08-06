import ObservationGoal from '../../interfaces/observation-goal.interface';
import { AbstractObservationGoalCommand } from './abstract-observation-goal.command';

export class UpdateObservationGoalCommand extends AbstractObservationGoalCommand {
    constructor(legalEntityId: string, observationGoal: ObservationGoal) {
        super(legalEntityId, observationGoal);
    }
}
