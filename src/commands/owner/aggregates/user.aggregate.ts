import {UserRegistered} from '../../../events/user';
import {UserState, UserStateImpl} from './user-state';
import {Aggregate} from '../../../event-store/aggregate';
import {EventMessage} from '../../../event-store/event-message';

export class UserAggregate extends Aggregate {
  state!: UserState;

  constructor(private readonly aggregateId: string) {
    super();
  }

  register(ownerId: string, password: string) {
    this.simpleApply(new UserRegistered(this.aggregateId, ownerId, password));
  }

  private onUserRegistered(eventMessage: EventMessage) {
    const event: UserRegistered = eventMessage.data as UserRegistered;
    this.state = new UserStateImpl(this.aggregateId);
    this.logger.debug(`Not implemented: aggregate.eventHandler(${event.constructor.name})`);
  }
}
