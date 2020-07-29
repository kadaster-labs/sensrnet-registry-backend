import { DomainException } from './domain-exception';

export class NoSubscriptionException extends DomainException {
    constructor() {
        super(`No open subscription exists.`);
    }
}
