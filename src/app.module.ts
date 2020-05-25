import { Module } from "@nestjs/common";
import { OwnerModule } from "./owner/owner.module";
import { SensorModule } from "./sensor/sensor.module";


@Module({
  imports: [OwnerModule, SensorModule]
})

export class AppModule {}
