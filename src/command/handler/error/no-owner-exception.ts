import { DomainException } from '../../../core/errors/domain-exception';

export class NoOwnerException extends DomainException {
    constructor() {
        super(`User does not have an associated owner.`);
    }
}
