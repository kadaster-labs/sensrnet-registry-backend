import { connect } from 'mongoose';
import { Module, OnModuleInit } from "@nestjs/common";
import { CqrsModule, EventPublisher } from "@nestjs/cqrs";
import { OwnerEventHandler } from "./handlers/owner.handler"
import { EventStoreModule } from "../../event-store/event-store.module";
import { EventStorePublisher } from "../../event-store/event-store.publisher";


@Module({
  imports: [
    CqrsModule,
    EventStoreModule,
    OwnerQueryModule
  ],
  providers: [
    EventPublisher,
    OwnerEventHandler,
  ]
})

export class OwnerQueryModule implements OnModuleInit {
  constructor(
    private readonly eventStore: EventStorePublisher,
    private readonly ownerEventHandler: OwnerEventHandler    
  ) {}
  onModuleInit() {
    const host = process.env.MONGO_HOST || 'localhost';
    connect('mongodb://' + host + ':27017/owners', { useNewUrlParser: true , useUnifiedTopology: true});

    this.eventStore.subscribeToStream('$ce-owner', this.ownerEventHandler);
  }
}
