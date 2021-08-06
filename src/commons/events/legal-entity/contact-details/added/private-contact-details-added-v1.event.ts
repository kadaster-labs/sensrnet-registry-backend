import { LegalEntityEvent } from '../../legal-entity.event';

export class PrivateContactDetailsAdded extends LegalEntityEvent {
    static version = '1';

    readonly contactDetailsId: string;
    readonly name: string;
    readonly email: string;
    readonly phone: string;

    constructor(legalEntityId: string, contactDetailsId: string, name: string, email: string, phone: string) {
        super(legalEntityId, PrivateContactDetailsAdded.version);

        this.contactDetailsId = contactDetailsId;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
}
