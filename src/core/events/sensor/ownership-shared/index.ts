import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { SensorOwnershipShared as V1 } from './1.0.0/sensor-ownershipshared.event';

export { SensorOwnershipShared } from './1.0.0/sensor-ownershipshared.event';

export function getSensorOwnershipSharedEvent(eventMessage: EventMessage): V1 {
    return plainToClass(V1, eventMessage.data);
}
