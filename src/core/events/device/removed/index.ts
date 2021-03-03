import { plainToClass } from 'class-transformer';
import { DeviceRemoved as V1 } from './device-deleted-v1.event';
import { EventMessage } from '../../../../event-store/event-message';

export { DeviceRemoved } from './device-deleted-v1.event';

export function getDeviceRemovedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
