import { LegalEntityEvent } from '../../legal-entity.event';

export class OrganizationUpdated extends LegalEntityEvent {
    static version = '1';

    public readonly name: string;
    public readonly website: string;

    constructor(legalEntityId: string, name: string, website: string) {
        super(legalEntityId, OrganizationUpdated.version);
        this.name = name;
        this.website = website;
    }
}
