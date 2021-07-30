import { DomainException } from '../../../core/errors/domain-exception';

export class LegalEntityForRemovalContainsDevicesException extends DomainException {
  constructor(length: number) {
    super(`This legal entity can NOT be removed; it contains ${length} devices.`);
  }
}
