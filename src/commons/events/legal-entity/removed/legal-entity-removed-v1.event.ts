import { LegalEntityEvent } from '../legal-entity.event';

export class LegalEntityRemoved extends LegalEntityEvent {
    static version = '1';

    constructor(legalEntityId: string) {
        super(legalEntityId, LegalEntityRemoved.version);
    }
}
