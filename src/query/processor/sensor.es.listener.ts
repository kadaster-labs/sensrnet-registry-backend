import { SensorProcessor } from './sensor.processor';
import { plainToClass } from 'class-transformer';
import { sensorEventType } from '../../core/events/sensor';
import { NODE_ID } from '../../core/events/sensor/sensor.event';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CheckpointService } from '../service/checkpoint/checkpoint.service';
import { NoSubscriptionException } from '../handler/errors/no-subscription-exception';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { SubscriptionExistsException } from '../handler/errors/subscription-exists-exception';

@Injectable()
export class SensorEsListener implements OnModuleInit {

    private subscription;
    private checkpointId: string = 'backend-sensor-es';

    protected logger: Logger = new Logger(this.constructor.name);

    constructor(
        private readonly eventStore: EventStorePublisher,
        private readonly sensorProcessor: SensorProcessor,
        private readonly checkpointService: CheckpointService,
    ) {}

    getSubscription() {
        return this.subscription;
    }

    setSubscription(subscription) {
        this.subscription = subscription;
    }

    subscriptionExists() {
        return !!this.getSubscription();
    }

    closeSubscription() {
        if (this.subscription) {
            this.subscription.stop();
            this.subscription = null;
        } else {
            throw new NoSubscriptionException();
        }
    }

    async openSubscription() {
        if (!this.subscriptionExists()) {
            const onEvent = async (_, eventMessage) => {
                const offset = eventMessage.positionEventNumber;
                const callback = () => this.checkpointService.updateOne({_id: this.checkpointId}, {offset});

                if (eventMessage.metadata && eventMessage.metadata.originSync) {
                    if (!eventMessage.data || eventMessage.data.nodeId === NODE_ID) {
                        this.logger.debug('Not implemented: Handle sync event of current node.');
                        await callback();
                    } else {
                        const event = plainToClass(sensorEventType.getType(eventMessage.eventType), eventMessage.data);
                        try {
                            await this.sensorProcessor.process(event);
                            await callback();
                        } catch {
                            await callback();
                        }
                    }
                } else {
                    const event = plainToClass(sensorEventType.getType(eventMessage.eventType), eventMessage.data);
                    try {
                        await this.sensorProcessor.process(event);
                        await callback();
                    } catch {
                        await callback();
                    }
                }
            };

            await this.subscribeToStreamFrom('$ce-sensor', this.checkpointId, onEvent);
        } else {
            throw new SubscriptionExistsException();
        }
    }

    async getOffset() {
        const checkpoint = await this.checkpointService.findOne({_id: this.checkpointId});
        return checkpoint ? checkpoint.offset : -1;
    }

    async setOffset(offset) {
        if (!this.subscriptionExists()) {
            await this.checkpointService.updateOne({_id: this.checkpointId}, {offset});
        } else {
            throw new SubscriptionExistsException();
        }
    }

    async subscribeToStreamFrom(streamName, checkpointId, onEvent) {
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
            this.logger.log(`Subscribing to ES stream ${streamName} from offset ${offset}.`);

            try {
                const s = await this.eventStore.subscribeToStreamFrom(streamName, offset, onEvent, null, droppedCallback);
                clearTimeout(timeout);
                this.setSubscription(s);
            } catch {
                this.logger.error(`Failed to subscribe to stream ${streamName}.`);
            }
        } catch (e) {
            this.logger.error(`Failed to determine offset of stream ${streamName}.`);
        }
    }

    async onModuleInit() {
        await this.openSubscription();
    }
}
