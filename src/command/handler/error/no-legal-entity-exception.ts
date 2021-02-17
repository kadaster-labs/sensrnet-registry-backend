import { DomainException } from '../../../core/errors/domain-exception';

export class NoLegalEntityException extends DomainException {
    constructor() {
        super(`User does not have a legal entity associated.`);
    }
}
