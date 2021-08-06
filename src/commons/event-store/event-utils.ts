import { EventMessage } from './event-message';

export function isValidEvent(value: Record<string, any>): value is EventMessage {
    return (
        Object.prototype.hasOwnProperty.call(value, 'streamId') &&
        Object.prototype.hasOwnProperty.call(value, 'eventType') &&
        Object.prototype.hasOwnProperty.call(value, 'data') &&
        Object.prototype.hasOwnProperty.call(value, 'metadata')
    );
}
