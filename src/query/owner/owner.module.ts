import {connect} from 'mongoose';
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

@Module({
  imports: [
    CqrsModule,
    EventStoreModule,
    OwnerQueryModule,
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
      private readonly eventStore: EventStorePublisher,
      private readonly ownerProcessor: OwnerProcessor,
  ) {
  }

  onModuleInit() {
    const host = process.env.MONGO_HOST || 'localhost';
    const port = process.env.MONGO_PORT || 27017;
    const database = process.env.MONGO_DATABASE || 'sensrnet';

    const url = 'mongodb://' + host + ':' + port.toString() + '/' + database;
    connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

    const onEvent = (_, eventMessage) => {
      const event = plainToClass(ownerEventType.getType(eventMessage.eventType), eventMessage.data);
      this.ownerProcessor.process(event);
    };

    this.eventStore.subscribeToStream('$ce-owner', onEvent, () => {
      Logger.warn(`event stream dropped!`);
    });
  }
}
