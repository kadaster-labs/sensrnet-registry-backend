import { Module } from '@nestjs/common';
import { OwnerProcessor } from './processors';
import { OwnerGateway } from './owner.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnerSchema } from './models/owner.model';
import { OwnerController } from './owner.controller';
import { OwnerEsListener } from './owner.es.listener';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { OwnerEsController } from './owner.es.controller';
import { CheckpointModule } from '../checkpoint/checkpoint.module';
import { RetrieveOwnerQueryHandler } from './queries/retrieve.handler';
import { EventStoreModule } from '../../event-store/event-store.module';

@Module({
  imports: [
    CqrsModule,
    CheckpointModule,
    EventStoreModule,
    OwnerQueryModule,
    MongooseModule.forFeature([{name: 'Owner', schema: OwnerSchema}]),
  ],
  controllers: [
    OwnerController,
    OwnerEsController,
  ],
  providers: [
    OwnerGateway,
    EventPublisher,
    OwnerProcessor,
    OwnerEsListener,
    RetrieveOwnerQueryHandler,
  ],
})

export class OwnerQueryModule {}
