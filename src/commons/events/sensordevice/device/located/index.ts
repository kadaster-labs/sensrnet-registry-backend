import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { DeviceLocated as V1 } from './device-located-v1.event';

export { DeviceLocated } from './device-located-v1.event';

export function getDeviceLocatedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version
        ? plainToClass(V1, eventMessage.data)
        : null;
}
