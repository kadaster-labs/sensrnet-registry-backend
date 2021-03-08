import { Aggregate } from '../../event-store/aggregate';
import { EventMessage } from '../../event-store/event-message';
import { ObservationGoalState } from './observation-goal.state';
import { getObservationGoalRegisteredEvent, ObservationGoalRegistered } from '../events/observation-goal/registered';
import { getObservationGoalRemovedEvent, ObservationGoalRemoved } from '../events/observation-goal/removed';
import { getObservationGoalUpdatedEvent, ObservationGoalUpdated } from '../events/observation-goal/updated';

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

  onObservationGoalAdded(eventMessage: EventMessage): void {
    const event: ObservationGoalRegistered = getObservationGoalRegisteredEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  updateObservationGoal(legalEntityId: string, name: string, description: string, legalGround: string, legalGroundLink: string): void {
    this.simpleApply(new ObservationGoalUpdated(this.aggregateId, legalEntityId, name, description, legalGround, legalGroundLink));
  }

  onObservationGoalUpdated(eventMessage: EventMessage): void {
    const event: ObservationGoalUpdated = getObservationGoalUpdatedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }

  removeObservationGoal(legalEntityId: string): void {
    this.simpleApply(new ObservationGoalRemoved(this.aggregateId, legalEntityId));
  }

  onObservationGoalRemoved(eventMessage: EventMessage): void {
    const event: ObservationGoalRemoved = getObservationGoalRemovedEvent(eventMessage);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
