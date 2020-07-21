import { OwnerProcessor } from './processors';
import { OwnerGateway } from './owner.gateway';
import { plainToClass } from 'class-transformer';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnerSchema } from './models/owner.model';
import { ownerEventType } from '../../events/owner';
import { OwnerController } from './owner.controller';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { CheckpointService } from '../checkpoint/checkpoint.service';
import { RetrieveOwnerQueryHandler } from './queries/retrieve.handler';
import { EventStoreModule } from '../../event-store/event-store.module';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { CheckpointModule } from '../checkpoint/checkpoint.module';

@Module({
  imports: [
    CqrsModule,
    CheckpointModule,
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

  protected logger: Logger = new Logger(this.constructor.name);

  constructor(
      private readonly ownerProcessor: OwnerProcessor,
      private readonly eventStore: EventStorePublisher,
      private readonly checkpointService: CheckpointService,
  ) {
  }

  subscribeToStreamFrom(streamName, checkpointId, onEvent) {
    const timeoutMs = process.env.EVENT_STORE_TIMEOUT ? Number(process.env.EVENT_STORE_TIMEOUT) : 10000;

    const exitCallback = () => {
      this.logger.error(`Failed to connect to EventStore. Exiting.`);
      process.exit(0);
    };

    const timeout = setTimeout(exitCallback, timeoutMs);
    this.checkpointService.findOne({_id: checkpointId}).then((data) => {
      const offset = data ? data.offset : -1;
      this.logger.log(`Subscribing to ES stream ${streamName} from offset ${offset}.`);

      this.eventStore.subscribeToStreamFrom(streamName, offset, onEvent, null, exitCallback)
          .then(() => clearTimeout(timeout), () => this.logger.error(`Failed to subscribe to stream ${streamName}.`));
    }, () => this.logger.error(`Failed to determine offset of stream ${streamName}.`));
  }

  onModuleInit() {
    const onEvent = (_, eventMessage) => {
      const offset = eventMessage.positionEventNumber;
      const event = plainToClass(ownerEventType.getType(eventMessage.eventType), eventMessage.data);
      const callback = () => this.checkpointService.updateOne({_id: 'owner'}, {offset});
      this.ownerProcessor.process(event).then(callback, callback);
    };

    this.subscribeToStreamFrom('$ce-owner', 'owner', onEvent);
  }
}
