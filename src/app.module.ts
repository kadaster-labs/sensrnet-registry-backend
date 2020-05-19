import { OwnerModule } from './owner/owner.module';
import { Module, OnModuleInit } from '@nestjs/common';
import { SensorModule } from './sensor/sensor.module';
import { EventStoreModule } from './eventstore/event-store.module';


@Module({
  imports: [
    EventStoreModule.forRoot(),
    OwnerModule,
    SensorModule
  ],
})


export class AppModule implements OnModuleInit {
  async onModuleInit() {}
}
