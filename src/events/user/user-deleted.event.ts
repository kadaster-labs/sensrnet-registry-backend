import { UserEvent } from './user.event';

export class UserDeleted extends UserEvent {

  constructor(email: string) {
    super(email);
  }
}
