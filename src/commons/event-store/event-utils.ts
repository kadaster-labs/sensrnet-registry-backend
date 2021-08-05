import { EventMessage } from './event-message';

export function isValidEvent(value: Record<string, any>): value is EventMessage {
  return (
      value.hasOwnProperty('streamId') &&
      value.hasOwnProperty('eventType') &&
      value.hasOwnProperty('data') &&
      value.hasOwnProperty('metadata')
  );
}
