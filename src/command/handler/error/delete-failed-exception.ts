import { DomainException } from '../../../commons/errors/domain-exception';

export class DeleteFailedException extends DomainException {
    constructor(email: string) {
        super(`Failed to delete user: ${email}.`);
    }
}
