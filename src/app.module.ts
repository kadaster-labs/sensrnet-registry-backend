import { Module } from "@nestjs/common";
import { OwnerCommandModule } from "./commands/owner/owner.module";
import { SensorCommandModule } from "./commands/sensor/sensor.module";
import { OwnerQueryModule } from "./query/owner/owner.module";


@Module({
  imports: [
    OwnerCommandModule,
    SensorCommandModule,
    OwnerQueryModule
  ]
})

export class AppModule {}
