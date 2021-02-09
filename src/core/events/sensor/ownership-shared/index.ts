import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { SensorOwnershipShared as V1 } from './sensor-ownershipshared-v1.event';

export { SensorOwnershipShared } from './sensor-ownershipshared-v1.event';

export function getSensorOwnershipSharedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
