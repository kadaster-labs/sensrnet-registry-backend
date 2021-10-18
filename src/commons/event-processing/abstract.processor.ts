import { Logger, OnModuleInit } from '@nestjs/common';
import { Event as ESEvent } from 'geteventstore-promise';
import { EventStoreCatchUpSubscription } from 'node-eventstore-client';
import { NoSubscriptionException } from '../errors/no-subscription-exception';
import { SubscriptionExistsException } from '../errors/subscription-exists-exception';
import { Event } from '../event-store/event';
import { EventStorePublisher } from '../event-store/event-store.publisher';
import { CheckpointService } from './checkpoint/checkpoint.service';

export abstract class AbstractProcessor implements OnModuleInit {
    private subscription: EventStoreCatchUpSubscription;

    protected logger: Logger = new Logger(this.constructor.name);

    protected constructor(
        protected readonly checkpointId: string,
        protected readonly streamName: string,
        protected readonly eventStore: EventStorePublisher,
        protected readonly checkpointService: CheckpointService,
    ) {}

    abstract parseEvent(eventMessage: ESEvent): Event;

    abstract process(event: Event, originSync: boolean): Promise<void>;

    getSubscription(): EventStoreCatchUpSubscription {
        return this.subscription;
    }

    setSubscription(subscription: EventStoreCatchUpSubscription): void {
        this.subscription = subscription;
    }

    subscriptionExists(): boolean {
        return !!this.getSubscription();
    }

    closeSubscription(): void {
        if (this.subscription) {
            this.subscription.stop();
            this.subscription = null;
        } else {
            throw new NoSubscriptionException();
        }
    }

    async openSubscription(): Promise<void> {
        if (!this.subscriptionExists()) {
            await this.subscribeToStreamFromLastOffset(this.streamName);
        } else {
            throw new SubscriptionExistsException();
        }
    }

    async getOffset(): Promise<number> {
        const checkpoint = await this.checkpointService.findOne({ _id: this.checkpointId });
        return checkpoint ? checkpoint.offset : -1;
    }

    async setOffset(offset: number): Promise<void> {
        if (!this.subscriptionExists()) {
            await this.checkpointService.updateOne({ _id: this.checkpointId }, { offset });
        } else {
            throw new SubscriptionExistsException();
        }
    }

    async subscribeToStreamFromLastOffset(streamName: string): Promise<void> {
        const timeoutMs = process.env.EVENT_STORE_TIMEOUT ? Number(process.env.EVENT_STORE_TIMEOUT) : 10000;

        const exitCallback = () => {
            this.logger.error(`Failed to connect to EventStore. Exiting.`);
            process.exit(0);
        };

        const droppedCallback = (_, reason) => {
            if (reason !== 'userInitiated') {
                exitCallback();
            }
        };

        const timeout = setTimeout(exitCallback, timeoutMs);
        try {
            const offset = await this.getOffset();
            const onEvent = async (_, eventMessage) => {
                if (eventMessage.positionEventNumber > offset) {
                    const callback = () => {
                        return this.checkpointService.updateOne(
                            { _id: this.checkpointId },
                            { offset: eventMessage.positionEventNumber },
                        );
                    };

                    try {
                        const event = this.parseEvent(eventMessage);
                        const originSync = eventMessage.metadata && eventMessage.metadata.originSync;

                        await this.process(event, originSync);
                    } catch (error) {
                        this.logger.error(error);
                    } finally {
                        await callback();
                    }
                }
            };

            this.logger.log(`Subscribing to ES stream ${streamName} from offset ${offset}.`);

            try {
                const subscription = await this.eventStore.subscribeToStreamFrom(
                    streamName,
                    offset,
                    onEvent,
                    null,
                    droppedCallback,
                );
                subscription[`_connection`].on('closed', reason => droppedCallback(null, reason));

                clearTimeout(timeout);
                this.setSubscription(subscription);
            } catch {
                this.logger.error(`Failed to subscribe to stream ${streamName}.`);
            }
        } catch (e) {
            this.logger.error(`Failed to determine offset of stream ${streamName}.`);
        }
    }

    async onModuleInit(): Promise<void> {
        await this.openSubscription();
    }
}
