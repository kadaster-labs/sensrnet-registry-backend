import { DomainException } from '../../../core/errors/domain-exception';

export class NotAnOwnerException extends DomainException {
    constructor(organizationId: string, sensorId: string) {
        super(`Organization ${organizationId} does not own sensor ${sensorId}.`);
    }
}
