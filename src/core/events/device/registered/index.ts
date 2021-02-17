import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { DeviceRegistered as V1 } from './device-registered-v1.event';

export { DeviceRegistered } from './device-registered-v1.event';

export function getDeviceRegisteredEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
