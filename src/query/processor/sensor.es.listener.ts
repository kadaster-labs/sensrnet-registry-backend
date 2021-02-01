import { Injectable } from '@nestjs/common';
import { SensorProcessor } from './sensor.processor';
import { sensorEventType } from '../../core/events/sensor';
import { AbstractEsListener } from './abstract.es.listener';
import { CheckpointService } from '../service/checkpoint/checkpoint.service';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { SubscriptionExistsException } from '../handler/errors/subscription-exists-exception';
import { SensorEvent } from '../../core/events/sensor/sensor.event';

@Injectable()
export class SensorEsListener extends AbstractEsListener {

    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        private readonly sensorProcessor: SensorProcessor,
    ) {
        super('backend-sensor-es', eventStore, checkpointService);
    }

    async openSubscription(): Promise<void> {
        if (!this.subscriptionExists()) {
            const onEvent = async (_, eventMessage) => {
                const offset = eventMessage.positionEventNumber;
                const callback = () => this.checkpointService.updateOne({_id: this.checkpointId}, {offset});

                const event = sensorEventType.getEvent(eventMessage) as SensorEvent;
                try {
                    await this.sensorProcessor.process(event);
                    await callback();
                } catch {
                    await callback();
                }
            };

            await this.subscribeToStreamFrom('$ce-sensor', onEvent);
        } else {
            throw new SubscriptionExistsException();
        }
    }
}
