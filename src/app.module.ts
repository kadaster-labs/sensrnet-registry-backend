import { Module } from "@nestjs/common";
import { OwnerModule } from "./owner/owner.module";

@Module({
  imports: [OwnerModule]
})
export class AppModule {}
