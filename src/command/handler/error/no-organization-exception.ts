import { DomainException } from '../../../core/errors/domain-exception';

export class NoOrganizationException extends DomainException {
    constructor() {
        super(`User does not have an organization associated.`);
    }
}
