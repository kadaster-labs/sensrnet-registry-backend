import { Module } from "@nestjs/common";
import { OwnerModule } from "./commands/owner/owner.module";
import { SensorModule } from "./commands/sensor/sensor.module";
import { OwnerQueryModule } from "./query/owner/owner.module";


@Module({
  imports: [
    OwnerModule,
    SensorModule,
    OwnerQueryModule
  ]
})

export class AppModule {}
