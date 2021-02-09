import { Injectable } from '@nestjs/common';
import { AbstractEsListener } from './abstract.es.listener';
import { OrganizationProcessor } from './organization.processor';
import { CheckpointService } from '../service/checkpoint/checkpoint.service';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { Event as ESEvent } from 'geteventstore-promise';
import { OrganizationEvent } from '../../core/events/organization/organization.event';
import { organizationEventType } from '../../core/events/organization';

@Injectable()
export class OrganizationEsListener extends AbstractEsListener {
    constructor(
        eventStore: EventStorePublisher,
        checkpointService: CheckpointService,
        organizationProcessor: OrganizationProcessor,
    ) {
        super('backend-organization-es', '$ce-organization', eventStore, checkpointService, organizationProcessor);
    }

    parseEvent(eventMessage: ESEvent): OrganizationEvent {
        return organizationEventType.getEvent(eventMessage) as OrganizationEvent;
    }
}
