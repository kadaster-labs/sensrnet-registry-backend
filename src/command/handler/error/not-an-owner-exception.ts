import { DomainException } from '../../../core/errors/domain-exception';

export class NotAnOwnerException extends DomainException {
    constructor(ownerId: string, sensorId) {
        super(`Owner ${ownerId} does not own sensor ${sensorId}.`);
    }
}
