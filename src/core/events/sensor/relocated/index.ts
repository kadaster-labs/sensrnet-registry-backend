import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { SensorRelocated as V1 } from './1.0.0/sensor-relocated.event';
import { SensorRelocated as V2 } from './1.0.1/sensor-relocated.event';

export { SensorRelocated } from './1.0.1/sensor-relocated.event';

export function getSensorRelocatedEvent(eventMessage: EventMessage): V2 {
    if (!eventMessage.metadata.version || eventMessage.metadata.version === V1.version) {
        const { longitude, latitude, height, ...other } = eventMessage.data;
        const upcastedEventMessage = {
            ...eventMessage,
            data: {...other, location: [longitude, latitude, height]},
            metadata: {...eventMessage.metadata, version: V2.version},
        };
        return getSensorRelocatedEvent(upcastedEventMessage) ;
    } else if (eventMessage.metadata.version === V2.version) {
        return plainToClass(V2, eventMessage.data);
    } else {
        return null;
    }
}
