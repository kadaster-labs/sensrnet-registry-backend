import { Event } from '../../event-store/event';

export abstract class UserEvent extends Event {

  readonly email: string;

  constructor(email: string) {
    super(email);
    this.email = email;
  }

  streamRoot(): string {
    return 'user';
  }

}
