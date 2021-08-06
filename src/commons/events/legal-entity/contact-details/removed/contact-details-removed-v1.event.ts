import { LegalEntityEvent } from '../../legal-entity.event';

export class ContactDetailsRemoved extends LegalEntityEvent {
    static version = '1';

    readonly legalEntityId: string;
    readonly contactDetailsId: string;

    constructor(legalEntityId: string, contactDetailsId: string) {
        super(legalEntityId, ContactDetailsRemoved.version);

        this.legalEntityId = legalEntityId;
        this.contactDetailsId = contactDetailsId;
    }
}
