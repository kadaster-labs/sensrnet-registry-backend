import {OwnerController} from './owner.controller';
import {Logger, Module, OnModuleInit} from '@nestjs/common';
import {CqrsModule, EventPublisher} from '@nestjs/cqrs';
import {EventStoreModule} from '../../event-store/event-store.module';
import {EventStorePublisher} from '../../event-store/event-store.publisher';
import {RetrieveOwnerQueryHandler} from './queries/retrieve.handler';
import {OwnerProcessor} from './processors';
import {plainToClass} from 'class-transformer';
import {ownerEventType} from '../../events/owner';
import {OwnerGateway} from './owner.gateway';
import {MongooseModule} from '@nestjs/mongoose';
import {OwnerSchema} from './models/owner.model';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule,
    OwnerQueryModule,
    MongooseModule.forFeature([{name: 'Owner', schema: OwnerSchema}]),
  ],
  controllers: [OwnerController],
  providers: [
    EventPublisher,
    OwnerProcessor,
    RetrieveOwnerQueryHandler,
    OwnerGateway,
  ],
})

export class OwnerQueryModule implements OnModuleInit {
  constructor(
      private readonly ownerProcessor: OwnerProcessor,
      private readonly eventStore: EventStorePublisher,
  ) {
  }

  onModuleInit() {
    const onEvent = (_, eventMessage) => {
      const event = plainToClass(ownerEventType.getType(eventMessage.eventType), eventMessage.data);
      this.ownerProcessor.process(event);
    };

    this.eventStore.subscribeToStream('$ce-owner', onEvent, () => {
      Logger.warn(`event stream dropped!`);
    });
  }
}
