import {EventMessage} from './event-message';

export function isValidEvent(value: any): value is EventMessage {
  return (
      value.hasOwnProperty('streamId') &&
      value.hasOwnProperty('eventType') &&
      value.hasOwnProperty('data') &&
      value.hasOwnProperty('metadata')
  );
}
