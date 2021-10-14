import { Injectable } from '@nestjs/common';
import { AbstractEsListener } from '../../commons/event-processing/abstract.es.listener';
import { OrganizationRegistered } from '../../commons/events/legal-entity';
import { LegalEntityEvent } from '../../commons/events/legal-entity/legal-entity.event';
import { UserService } from '../repositories/user.service';
import { GrantRightsLegalEntityProcessor } from './grant-rights-legal-entity.processors';

@Injectable()
export class GrantRightsLegalEntityEsListener extends AbstractEsListener {
    constructor(
        protected readonly userService: UserService,
        protected readonly processor: GrantRightsLegalEntityProcessor,
    ) {
        super(processor);
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
