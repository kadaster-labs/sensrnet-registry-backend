import { ObservationGoalEvent } from '../observation-goal.event';

export class ObservationGoalUpdated extends ObservationGoalEvent {
  static version = '1';

  readonly dataStreamId: string;
  readonly observationGoalId: string;
  readonly legalEntityId: string;
  readonly name: string;
  readonly description: string;
  readonly legalGround: string;
  readonly legalGroundLink: string;

  constructor(deviceId: string, dataStreamId: string, observationGoalId: string, legalEntityId: string, name: string,
    description: string, legalGround: string, legalGroundLink: string) {
    super(deviceId, ObservationGoalUpdated.version);
    this.dataStreamId = dataStreamId;
    this.observationGoalId = observationGoalId;
    this.legalEntityId = legalEntityId;
    this.name = name;
    this.description = description;
    this.legalGround = legalGround;
    this.legalGroundLink = legalGroundLink;
  }
}
