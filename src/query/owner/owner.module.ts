import { connect } from 'mongoose';
import { OwnerController } from "./owner.controller";
import { Module, OnModuleInit } from "@nestjs/common";
import { CqrsModule, EventPublisher } from "@nestjs/cqrs";
import { OwnerEventHandler } from "./handlers/owner.handler";
import { EventStoreModule } from "../../event-store/event-store.module";
import { EventStorePublisher } from "../../event-store/event-store.publisher";
import { RetrieveOwnerQueryHandler } from "./queries/retrieve.handler";


@Module({
  imports: [
    CqrsModule,
    EventStoreModule,
    OwnerQueryModule
  ],
  controllers: [OwnerController],
  providers: [
    EventPublisher,
    OwnerEventHandler,
    RetrieveOwnerQueryHandler
  ]
})

export class OwnerQueryModule implements OnModuleInit {
  constructor(
    private readonly eventStore: EventStorePublisher,
    private readonly ownerEventHandler: OwnerEventHandler    
  ) {}
  onModuleInit() {
    const host = process.env.MONGO_HOST || 'localhost';
    const port = process.env.MONGO_PORT || 27017;
    const database = process.env.MONGO_DATABASE || 'owners';

    const url = 'mongodb://' + host + ':' + port.toString() + '/' + database;
    connect(url, { useNewUrlParser: true , useUnifiedTopology: true});

    this.eventStore.subscribeToStream('$ce-owner', this.ownerEventHandler);
  }
}
