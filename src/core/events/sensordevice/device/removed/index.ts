import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../../event-store/event-message';
import { DeviceRemoved as V1 } from './device-removed-v1.event';

export { DeviceRemoved } from './device-removed-v1.event';

export function getDeviceRemovedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
