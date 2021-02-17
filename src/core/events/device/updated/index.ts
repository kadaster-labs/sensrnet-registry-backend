import { plainToClass } from 'class-transformer';
import { DeviceUpdated as V1 } from './device-updated-v1.event';
import { EventMessage } from '../../../../event-store/event-message';

export { DeviceUpdated } from './device-updated-v1.event';

export function getDeviceUpdatedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
