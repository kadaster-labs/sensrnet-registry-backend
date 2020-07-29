import { DomainException } from './domain-exception';

export class SubscriptionExistsException extends DomainException {
    constructor() {
        super(`A subscription exists. Close the subscription first.`);
    }
}
