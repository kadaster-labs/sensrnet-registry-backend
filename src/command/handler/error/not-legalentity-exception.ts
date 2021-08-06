import { DomainException } from '../../../commons/errors/domain-exception';

export class NotLegalEntityException extends DomainException {
    constructor(id: string) {
        super(`Object ${id} does not belong to your legal entity.`);
    }
}
