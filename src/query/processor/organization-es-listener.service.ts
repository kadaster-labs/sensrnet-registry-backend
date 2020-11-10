import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { NODE_ID } from '../../event-store/event';
import { OrganizationProcessor } from './organization.processor';
import { organizationEventType } from '../../core/events/organization';
import { AbstractEsListener } from './abstract.es.listener';
import { OrganizationEvent } from '../../core/events/organization/organizationEvent';
import { CheckpointService } from '../service/checkpoint/checkpoint.service';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { SubscriptionExistsException } from '../handler/errors/subscription-exists-exception';

@Injectable()
export class OrganizationEsListener extends AbstractEsListener {
    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        private readonly organizationProcessor: OrganizationProcessor,
    ) {
        super('backend-organization-es', eventStore, checkpointService);
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
                        const event: OrganizationEvent = plainToClass(organizationEventType.getType(eventMessage.eventType),
                            eventMessage.data as OrganizationEvent);
                        try {
                            await this.organizationProcessor.process(event);
                            await callback();
                        } catch {
                            await callback();
                        }
                    }
                } else {
                    const event: OrganizationEvent = plainToClass(organizationEventType.getType(eventMessage.eventType),
                        eventMessage.data as OrganizationEvent);
                    try {
                        await this.organizationProcessor.process(event);
                        await callback();
                    } catch {
                        await callback();
                    }
                }
            };

            await this.subscribeToStreamFrom('$ce-organization', onEvent);
        } else {
            throw new SubscriptionExistsException();
        }
    }
}
