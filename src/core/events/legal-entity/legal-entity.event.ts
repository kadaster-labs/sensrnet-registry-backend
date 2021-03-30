import { Event } from '../../../event-store/event';
import { legalEntityStreamRootValue } from './legal-entity.stream';

export abstract class LegalEntityEvent extends Event {

  static streamRootValue = legalEntityStreamRootValue;

  protected constructor(legalEntityId: string, version: string) {
    super(legalEntityId, version);
  }

  streamRoot(): string {
    return LegalEntityEvent.streamRootValue;
  }
}
