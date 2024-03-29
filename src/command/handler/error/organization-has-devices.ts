import { DomainException } from '../../../commons/errors/domain-exception';

export class OrganizationHasDevices extends DomainException {
    constructor() {
        super(`This organization still has devices and therefore cannot be deleted.`);
    }
}
