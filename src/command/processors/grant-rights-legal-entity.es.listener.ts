import { Injectable } from '@nestjs/common';
import { AbstractEsListener } from '../../commons/event-processing/abstract.es.listener';
import { OrganizationRegistered } from '../../commons/events/legal-entity';
import { UserService } from '../repositories/user.service';

@Injectable()
export class GrantRightsLegalEntityEsListener extends AbstractEsListener {
    constructor(protected readonly userService: UserService) {
        super();
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
