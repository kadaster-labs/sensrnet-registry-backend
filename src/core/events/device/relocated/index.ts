import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { DeviceRelocated as V1 } from './device-relocated-v1.event';

export { DeviceRelocated } from './device-relocated-v1.event';

export function getDeviceRelocatedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
