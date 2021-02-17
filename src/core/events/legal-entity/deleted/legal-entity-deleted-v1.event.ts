import { LegalEntityEvent } from '../legal-entity.event';

export class LegalEntityDeleted extends LegalEntityEvent {
  static version = '1';

  constructor(legalEntityId: string) {
    super(legalEntityId, LegalEntityDeleted.version);
  }
}
