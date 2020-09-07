import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { NODE_ID } from '../../event-store/event';
import { OwnerProcessor } from './owner.processor';
import { ownerEventType } from '../../core/events/owner';
import { AbstractEsListener } from './abstract.es.listener';
import { OwnerEvent } from '../../core/events/owner/owner.event';
import { CheckpointService } from '../service/checkpoint/checkpoint.service';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { SubscriptionExistsException } from '../handler/errors/subscription-exists-exception';

@Injectable()
export class OwnerEsListener extends AbstractEsListener {

    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        private readonly ownerProcessor: OwnerProcessor,
    ) {
        super('backend-owner-es', eventStore, checkpointService);
    }

    async openSubscription(): Promise<void> {
        if (!this.subscriptionExists()) {
            const onEvent = async (_, eventMessage) => {
                const offset = eventMessage.positionEventNumber;
                const callback = () => this.checkpointService.updateOne({_id: this.checkpointId}, {offset});

                if (eventMessage.metadata && eventMessage.metadata.originSync) {
                    if (!eventMessage.data || eventMessage.data.nodeId === NODE_ID) {
                        this.logger.debug('Not implemented: Handle sync event of current node.');
                        await callback();
                    } else {
                        const event: OwnerEvent = plainToClass(ownerEventType.getType(eventMessage.eventType),
                            eventMessage.data as OwnerEvent);
                        try {
                            await this.ownerProcessor.process(event);
                            await callback();
                        } catch {
                            await callback();
                        }
                    }
                } else {
                    const event: OwnerEvent = plainToClass(ownerEventType.getType(eventMessage.eventType),
                        eventMessage.data as OwnerEvent);
                    try {
                        await this.ownerProcessor.process(event);
                        await callback();
                    } catch {
                        await callback();
                    }
                }
            };

            await this.subscribeToStreamFrom('$ce-owner', onEvent);
        } else {
            throw new SubscriptionExistsException();
        }
    }
}
