import { plainToClass } from 'class-transformer';
import { EventMessage } from '../../../../event-store/event-message';
import { SensorRegistered as V1 } from './1.0.0/sensor-registered.event';
import { SensorRegistered as V2 } from './1.0.1/sensor-registered.event';

export { SensorRegistered } from './1.0.1/sensor-registered.event';

export function getSensorRegisteredEvent(eventMessage: EventMessage): V2 {
    if (!eventMessage.metadata.version || eventMessage.metadata.version === V1.version) {
        const { longitude, latitude, height, ...other } = eventMessage.data;
        const upcastedEventMessage = {
            ...eventMessage,
            data: {...other, location: [longitude, latitude, height]},
            metadata: {...eventMessage.metadata, version: V2.version},
        };
        return getSensorRegisteredEvent(upcastedEventMessage) ;
    } else {
        return plainToClass(V2, eventMessage.data);
    }
}
