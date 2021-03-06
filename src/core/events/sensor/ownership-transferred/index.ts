import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { SensorOwnershipTransferred as V1 } from './sensor-ownershiptransferred-v1.event';

export { SensorOwnershipTransferred } from './sensor-ownershiptransferred-v1.event';

export function getSensorOwnershipTransferredEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
