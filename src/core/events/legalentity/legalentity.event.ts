import { Event } from '../../../event-store/event';

export abstract class LegalEntityEvent extends Event {

  static streamRootValue = 'legalentity';

  readonly legalEntityId: string;

  protected constructor(legalEntityId: string, version: string) {
    super(legalEntityId, version);

    this.legalEntityId = legalEntityId;
  }

  streamRoot(): string {
    return LegalEntityEvent.streamRootValue;
  }
}
