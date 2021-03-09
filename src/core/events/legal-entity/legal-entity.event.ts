import { Event } from '../../../event-store/event';
import { legalEntityEventType } from './legal-entity-event-type';

export abstract class LegalEntityEvent extends Event {

  static streamRootValue = legalEntityEventType.streamRootValue;

  protected constructor(legalEntityId: string, version: string) {
    super(legalEntityId, version);
  }

  streamRoot(): string {
    return LegalEntityEvent.streamRootValue;
  }
}
