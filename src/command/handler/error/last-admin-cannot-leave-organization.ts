import { DomainException } from '../../../commons/errors/domain-exception';

export class LastAdminCannotLeaveOrganization extends DomainException {
    constructor() {
        super(`This user is the last ADMIN of this organization and therefore can NOT leave.`);
    }
}
