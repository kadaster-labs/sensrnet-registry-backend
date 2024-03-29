import { DomainException } from '../../../commons/errors/domain-exception';

export class AlreadyExistsException extends DomainException {
    constructor(name: string) {
        super(`Object ${name} already exists.`);
    }
}
