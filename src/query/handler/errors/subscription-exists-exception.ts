import { DomainException } from '../../../core/errors/domain-exception';

export class SubscriptionExistsException extends DomainException {
    constructor() {
        super(`A subscription exists. Close the subscription first.`);
    }
}
