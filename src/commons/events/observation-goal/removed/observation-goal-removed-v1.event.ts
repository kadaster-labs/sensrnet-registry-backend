import { ObservationGoalEvent } from '../observation-goal.event';

export class ObservationGoalRemoved extends ObservationGoalEvent {
    static version = '1';

    readonly observationGoalId: string;
    readonly legalEntityId: string;

    constructor(observationGoalId: string, legalEntityId: string) {
        super(observationGoalId, ObservationGoalRemoved.version);

        this.observationGoalId = observationGoalId;
        this.legalEntityId = legalEntityId;
    }
}
