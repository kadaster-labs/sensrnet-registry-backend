export interface ObservationGoalState {
  id: string;
}

export class ObservationGoalStateImpl implements ObservationGoalState {
  constructor(
      public readonly id: string,
  ) {}
}
