import { UserEvent } from './user.event';

export class UserRegistered extends UserEvent {

  public readonly ownerId: string;
  public readonly password: string;

  constructor(email: string, ownerId: string, password: string) {
    super(email);
    this.ownerId = ownerId;
    this.password = password;
  }
}
