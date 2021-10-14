import { Injectable } from '@nestjs/common';
import { AbstractProcessor } from '../../../commons/event-processing/abstract.processor';
import { EventStorePublisher } from '../../../commons/event-store/event-store.publisher';
import { OrganizationRegistered } from '../../../commons/events/legal-entity';
import { LegalEntityEvent } from '../../../commons/events/legal-entity/legal-entity.event';
import { UserService } from '../../repositories/user.service';
import { GrantAdminRightsESListener } from './grand-admin-rights.listener';

@Injectable()
export class GrantAdminRightsProcessor extends AbstractProcessor {
    constructor(
        eventStore: EventStorePublisher,
        private readonly userService: UserService,
        protected readonly listener: GrantAdminRightsESListener,
    ) {
        super(listener);
    }

    async process(event: LegalEntityEvent, originSync: boolean): Promise<void> {
        if (event instanceof OrganizationRegistered) {
            await this.processRegistered(event, originSync);
        }
    }

    async processRegistered(event: OrganizationRegistered, originSync: boolean): Promise<void> {
        try {
            if (!originSync) {
                await this.userService.grantAdminPermissionForOrganization(event.userId, event.aggregateId);
            }
        } catch {
            super.errorCallback(event);
        }
    }
}
