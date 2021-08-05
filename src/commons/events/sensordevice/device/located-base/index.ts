import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { DeviceLocatedAtBaseObject as V1 } from './device-located-at-base-v1.event';

export { DeviceLocatedAtBaseObject } from './device-located-at-base-v1.event';

export function getDeviceLocatedAtBaseObjectEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
