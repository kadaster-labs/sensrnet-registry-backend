import { plainToClass } from 'class-transformer';
import { DeviceDeleted as V1 } from './device-deleted-v1.event';
import { EventMessage } from '../../../../event-store/event-message';

export { DeviceDeleted } from './device-deleted-v1.event';

export function getDeviceDeletedEvent(eventMessage: EventMessage): V1 {
    return !eventMessage.metadata.version || eventMessage.metadata.version === V1.version ? plainToClass(V1, eventMessage.data) : null;
}
