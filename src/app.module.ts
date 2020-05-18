import { Module, OnModuleInit } from '@nestjs/common';
import { SensorModule } from './sensor/sensor.module';
import { EventStoreModule } from './core/event-store/event-store.module';

@Module({
  imports: [
    EventStoreModule.forRoot(),
    /** ------------- */
    SensorModule
  ],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {}
}
