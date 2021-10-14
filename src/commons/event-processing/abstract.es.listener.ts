import { Logger } from '@nestjs/common';
import { Event } from '../event-store/event';
import { AbstractProcessor } from './abstract.processor';

export abstract class AbstractEsListener {
    protected logger: Logger = new Logger(this.constructor.name);

    protected constructor(protected readonly processor: AbstractProcessor | AbstractProcessor[]) {
        const processors = processor instanceof AbstractProcessor ? [processor] : processor;
        processors.forEach(x => x.addListener(this));
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    protected static defined(value: any): boolean {
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
