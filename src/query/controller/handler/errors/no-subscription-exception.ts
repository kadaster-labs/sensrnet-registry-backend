import { DomainException } from '../../../../core/errors/domain-exception';

export class NoSubscriptionException extends DomainException {
    constructor() {
        super(`No open subscription exists.`);
    }
}
