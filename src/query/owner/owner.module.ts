import { connect } from 'mongoose';
import { OwnerController } from "./owner.controller";
import { Module, OnModuleInit } from "@nestjs/common";
import { CqrsModule, EventPublisher, CommandBus } from "@nestjs/cqrs";
import { EventStoreModule } from "../../event-store/event-store.module";
import { EventStorePublisher } from "../../event-store/event-store.publisher";
import { RetrieveOwnerQueryHandler } from "./queries/retrieve.handler";
import { EventType } from "../../events/owner/events/event-type";
import { OwnerCreatedHandler, OwnerUpdatedHandler, OwnerDeletedHandler  } from './commands';
import { OwnerCreatedCommand, OwnerUpdatedCommand, OwnerDeletedCommand  } from './commands';


@Module({
  imports: [
    CqrsModule,
    EventStoreModule,
    OwnerQueryModule
  ],
  controllers: [OwnerController],
  providers: [
    EventPublisher,
    RetrieveOwnerQueryHandler,
    OwnerCreatedHandler, OwnerUpdatedHandler, OwnerDeletedHandler
  ]
})

export class OwnerQueryModule implements OnModuleInit {
  constructor(
    private readonly eventStore: EventStorePublisher,
    private readonly commandBus: CommandBus,  
  ) {}
  onModuleInit() {
    const host = process.env.MONGO_HOST || 'localhost';
    const port = process.env.MONGO_PORT || 27017;
    const database = process.env.MONGO_DATABASE || 'owners';

    const url = 'mongodb://' + host + ':' + port.toString() + '/' + database;
    connect(url, { useNewUrlParser: true , useUnifiedTopology: true});

    const onEvent = (_, event) => {
      const modulePrefix = 'owner';
      const modulePrefixLength = modulePrefix.length;
      const id = event.streamId.substring(modulePrefixLength + 1, event.streamId.length);

      if (event.eventType == EventType.Created) {
        this.commandBus.execute(new OwnerCreatedCommand(id, event.data));
      } else if (event.eventType == EventType.Updated) {
        this.commandBus.execute(new OwnerUpdatedCommand(id, event.data));
      } else if (event.eventType == EventType.Deleted) {
        this.commandBus.execute(new OwnerDeletedCommand(id));
      }
    };

    this.eventStore.subscribeToStream('$ce-owner', onEvent, () => {});
  }
}
