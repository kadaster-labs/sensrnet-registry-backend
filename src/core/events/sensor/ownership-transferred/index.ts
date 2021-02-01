import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { SensorOwnershipTransferred as V1 } from './1.0.0/sensor-ownershiptransferred.event';

export { SensorOwnershipTransferred } from './1.0.0/sensor-ownershiptransferred.event';

export function getSensorOwnershipTransferredEvent(eventMessage: EventMessage): V1 {
    return plainToClass(V1, eventMessage.data);
}
