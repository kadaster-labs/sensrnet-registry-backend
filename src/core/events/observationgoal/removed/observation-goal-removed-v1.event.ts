import { ObservationGoalEvent } from '../observationgoal.event';

export class ObservationGoalRemoved extends ObservationGoalEvent {
  static version = '1';

  readonly dataStreamId: string;
  readonly observationGoalId: string;
  readonly legalEntityId: string;

  constructor(deviceId: string, dataStreamId: string, observationGoalId: string, legalEntityId: string) {
    super(deviceId, ObservationGoalRemoved.version);

    this.dataStreamId = dataStreamId;
    this.observationGoalId = observationGoalId;
    this.legalEntityId = legalEntityId;
  }
}
