import { Aggregate } from '../../commons/event-store/aggregate';
import { EventMessage } from '../../commons/event-store/event-message';
import {
    getObservationGoalRegisteredEvent,
    ObservationGoalRegistered,
} from '../../commons/events/observation-goal/registered';
import { getObservationGoalRemovedEvent, ObservationGoalRemoved } from '../../commons/events/observation-goal/removed';
import { getObservationGoalUpdatedEvent, ObservationGoalUpdated } from '../../commons/events/observation-goal/updated';
import { NotLegalEntityException } from '../handler/error/not-legalentity-exception';
import { ObservationGoalState, ObservationGoalStateImpl } from './observation-goal.state';

export class ObservationGoalAggregate extends Aggregate {
    state!: ObservationGoalState;

    constructor(private readonly aggregateId: string) {
        super();
    }

    registerObservationGoal(
        legalEntityId: string,
        name: string,
        description: string,
        legalGround: string,
        legalGroundLink: string,
    ): void {
        this.simpleApply(
            new ObservationGoalRegistered(
                this.aggregateId,
                legalEntityId,
                name,
                description,
                legalGround,
                legalGroundLink,
            ),
        );
    }

    onObservationGoalRegistered(eventMessage: EventMessage): void {
        const event: ObservationGoalRegistered = getObservationGoalRegisteredEvent(eventMessage);
        this.state = new ObservationGoalStateImpl(this.aggregateId, event.legalEntityId);
    }

    updateObservationGoal(
        legalEntityId: string,
        name: string,
        description: string,
        legalGround: string,
        legalGroundLink: string,
    ): void {
        if (this.state.legalEntityId === legalEntityId) {
            this.simpleApply(
                new ObservationGoalUpdated(
                    this.aggregateId,
                    legalEntityId,
                    name,
                    description,
                    legalGround,
                    legalGroundLink,
                ),
            );
        } else {
            throw new NotLegalEntityException(this.aggregateId);
        }
    }

    onObservationGoalUpdated(eventMessage: EventMessage): void {
        const event: ObservationGoalUpdated = getObservationGoalUpdatedEvent(eventMessage);
        this.logUnusedInAggregate(event);
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
        this.logUnusedInAggregate(event);
    }
}
