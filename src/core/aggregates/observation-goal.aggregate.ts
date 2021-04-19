import { Aggregate } from '../../event-store/aggregate';
import { EventMessage } from '../../event-store/event-message';
import { ObservationGoalState, ObservationGoalStateImpl } from './observation-goal.state';
import { getObservationGoalRegisteredEvent, ObservationGoalRegistered } from '../events/observation-goal/registered';
import { getObservationGoalRemovedEvent, ObservationGoalRemoved } from '../events/observation-goal/removed';
import { getObservationGoalUpdatedEvent, ObservationGoalUpdated } from '../events/observation-goal/updated';
import { NotLegalEntityException } from '../../command/handler/error/not-legalentity-exception';

export class ObservationGoalAggregate extends Aggregate {

  state!: ObservationGoalState;

  constructor(
    private readonly aggregateId: string,
  ) {
    super();
  }

  registerObservationGoal(legalEntityId: string, name: string, description: string, legalGround: string, legalGroundLink: string): void {
    this.simpleApply(new ObservationGoalRegistered(this.aggregateId, legalEntityId, name, description, legalGround, legalGroundLink));
  }

  onObservationGoalRegistered(eventMessage: EventMessage): void {
    const event: ObservationGoalRegistered = getObservationGoalRegisteredEvent(eventMessage);
    this.state = new ObservationGoalStateImpl(this.aggregateId, event.legalEntityId);
  }

  updateObservationGoal(legalEntityId: string, name: string, description: string, legalGround: string, legalGroundLink: string): void {
    this.simpleApply(new ObservationGoalUpdated(this.aggregateId, legalEntityId, name, description, legalGround, legalGroundLink));
  }

  onObservationGoalUpdated(eventMessage: EventMessage): void {
    const event: ObservationGoalUpdated = getObservationGoalUpdatedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  removeObservationGoal(legalEntityId: string): void {
    if (this.state.legalEntityId === legalEntityId) {
      this.simpleApply(new ObservationGoalRemoved(this.aggregateId, legalEntityId));
    } else {
      throw new NotLegalEntityException(this.aggregateId);
    }
  }

  onObservationGoalRemoved(eventMessage: EventMessage): void {
    const event: ObservationGoalRemoved = getObservationGoalRemovedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
