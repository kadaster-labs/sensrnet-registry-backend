import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { DatastreamUpdated as V1 } from './datastream-updated-v1.event';
import { DatastreamUpdated as V2 } from './datastream-updated-v2.event';

export { DatastreamUpdated } from './datastream-updated-v2.event';

function upcastEvent(event): V2 {
    if (event.version === V1.version) {
        const eventV2 = new V2(
            event.deviceId,
            event.sensorId,
            event.legalEntityId,
            event.datastreamId,
            event.name,
            event.description,
            event.unitOfMeasurement,
            event.observationArea,
            event.theme,
            event.dataQuality,
            event.isActive,
            event.isPublic,
            event.isOpenData,
            event.containsPersonalInfoData,
            event.isReusable,
            event.documentation,
            event.dataLink,
        );

        return upcastEvent(eventV2);
    } else if (event.version === V2.version) {
        return event;
    } else {
        return null;
    }
}

export function getDatastreamUpdatedEvent(eventMessage: EventMessage): V2 {
    if (!eventMessage.metadata.version || eventMessage.metadata.version === V1.version) {
        return upcastEvent(plainToClass(V1, eventMessage.data));
    } else if (eventMessage.metadata.version === V2.version) {
        return upcastEvent(plainToClass(V2, eventMessage.data));
    } else {
        return null;
    }
}
