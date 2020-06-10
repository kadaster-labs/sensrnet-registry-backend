import {Module, OnModuleInit, Logger} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UserSchema} from '../../users/models/user.model';
import {EventStorePublisher} from '../../event-store/event-store.publisher';
import {UserProcessor} from './processors';
import {plainToClass} from 'class-transformer';
import {userEventType} from '../../events/user';
import {EventStoreModule} from '../../event-store/event-store.module';

@Module({
    imports: [
        EventStoreModule,
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    ],
    providers: [
        UserProcessor,
    ],
})

export class UserQueryModule implements OnModuleInit {
    constructor(
        private readonly eventStore: EventStorePublisher,
        private readonly userProcessor: UserProcessor,
    ) {
    }

    onModuleInit() {
      const onEvent = (_, eventMessage) => {
        const event = plainToClass(userEventType.getType(eventMessage.eventType), eventMessage.data);
        this.userProcessor.process(event);
      };

      this.eventStore.subscribeToStream('$ce-user', onEvent, () => {
        Logger.warn(`event stream dropped!`);
      });
    }
}
