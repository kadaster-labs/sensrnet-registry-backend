import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../../event-store/event-message';
import { DeviceRelocatedAtBaseObject as V1 } from './device-relocated-at-base-v1.event';

export { DeviceRelocatedAtBaseObject } from './device-relocated-at-base-v1.event';

export function getDeviceRelocatedAtBaseObjectEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
