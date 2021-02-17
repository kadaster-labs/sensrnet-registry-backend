import { Event } from '../../../event-store/event';

export abstract class LegalEntityEvent extends Event {

  static streamRootValue = 'legalentity';

  protected constructor(legalEntityId: string, version: string) {
    super(legalEntityId, version);
  }

  streamRoot(): string {
    return LegalEntityEvent.streamRootValue;
  }
}
