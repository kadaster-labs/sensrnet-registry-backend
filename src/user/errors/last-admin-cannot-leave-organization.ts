import { DomainException } from '../../core/errors/domain-exception';

export class LastAdminCannotLeaveOrganization extends DomainException {
  constructor() {
    super(`This user is the last ADMIN of this organization and therefor can NOT leave.`);
  }
}
