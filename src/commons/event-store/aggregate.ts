import { Logger } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { Event } from './event';
import { isValidEvent } from './event-utils';

export abstract class Aggregate extends AggregateRoot {
    protected logger: Logger = new Logger(this.constructor.name);

    simpleApply(event: Event): void {
        this.logApplyEvent(event);
        super.apply(event.toEventMessage());
    }
    protected getEventName(event: Event): string {
        if (isValidEvent(event)) {
            return event.eventType;
        } else {
            return super.getEventName(event);
        }
    }

    private logApplyEvent(event: Event) {
        this.logger.debug(`applying event [${event.constructor.name}]: ${JSON.stringify(event)}`);
    }

    protected logUnusedInAggregate(event: Event): void {
        this.logger.verbose(`Unused in aggregate.eventHandler(${event.constructor.name})`);
    }
}
