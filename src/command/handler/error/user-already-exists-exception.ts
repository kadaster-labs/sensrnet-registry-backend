import { DomainException } from '../../../commons/errors/domain-exception';

export class UserAlreadyExistsException extends DomainException {
    constructor(email: string) {
        super(`User ${email} already exists.`);
    }
}
