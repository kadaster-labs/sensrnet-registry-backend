export interface ObservationGoalState {
    id: string;
    legalEntityId: string;
}

export class ObservationGoalStateImpl implements ObservationGoalState {
    constructor(public readonly id: string, public readonly legalEntityId: string) {}
}
