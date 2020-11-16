import { Logger } from '@nestjs/common';
import { Event } from '../../event-store/event';
import { EventStorePublisher } from '../../event-store/event-store.publisher';

export abstract class AbstractProcessor {
    protected logger: Logger = new Logger(this.constructor.name);

    protected constructor(
        protected readonly eventStore: EventStorePublisher,
    ) {}

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    protected static isDefined(value: any): boolean {
        return typeof value !== 'undefined' && value !== null;
    }

    protected errorCallback(event: Event): void {
        if (event) {
            this.logError(event);
        }
    }

    protected logError(event: Event): void {
        this.logger.error(`Error while updating projection for ${event.aggregateId}.`);
    }

    abstract process(event: Event, originSync: boolean): Promise<void>;
}
