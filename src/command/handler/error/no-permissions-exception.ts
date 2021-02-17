import { DomainException } from '../../../core/errors/domain-exception';

export class NoPermissionsException extends DomainException {
    constructor(legalEntityId: string, id: string) {
        super(`Legal entity ${legalEntityId} does not have rights over object ${id}.`);
    }
}
