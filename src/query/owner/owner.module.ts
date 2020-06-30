import { OwnerProcessor } from './processors';
import { OwnerGateway } from './owner.gateway';
import { plainToClass } from 'class-transformer';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnerSchema } from './models/owner.model';
import { ownerEventType } from '../../events/owner';
import { OwnerController } from './owner.controller';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { RetrieveOwnerQueryHandler } from './queries/retrieve.handler';
import { EventStoreModule } from '../../event-store/event-store.module';
import { EventStorePublisher } from '../../event-store/event-store.publisher';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule,
    OwnerQueryModule,
    MongooseModule.forFeature([{name: 'Owner', schema: OwnerSchema}]),
  ],
  controllers: [OwnerController],
  providers: [
    OwnerGateway,
    EventPublisher,
    OwnerProcessor,
    RetrieveOwnerQueryHandler,
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
      this.ownerProcessor.process(event).then();
    };

    this.eventStore.subscribeToStream('$ce-owner', onEvent, () => {
      Logger.warn(`event stream dropped!`);
    }).then();
  }
}
