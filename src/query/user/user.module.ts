import { UserProcessor } from './processors';
import { plainToClass } from 'class-transformer';
import { userEventType } from '../../events/user';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../users/models/user.model';
import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { EventStoreModule } from '../../event-store/event-store.module';
import { EventStorePublisher } from '../../event-store/event-store.publisher';

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
        private readonly userProcessor: UserProcessor,
        private readonly eventStore: EventStorePublisher,
    ) {
    }

    onModuleInit() {
      const onEvent = (_, eventMessage) => {
        const event = plainToClass(userEventType.getType(eventMessage.eventType), eventMessage.data);
        this.userProcessor.process(event).then();
      };

      this.eventStore.subscribeToStream('$ce-user', onEvent, () => {
        Logger.warn(`event stream dropped!`);
      }).then();
    }
}
