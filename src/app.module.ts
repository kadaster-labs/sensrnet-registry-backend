import { Module } from '@nestjs/common';
import { OwnerCommandModule } from './commands/owner/owner.module';
import { SensorCommandModule } from './commands/sensor/sensor.module';
import { OwnerQueryModule } from './query/owner/owner.module';
import { SensorQueryModule } from './query/sensor/sensor.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    OwnerCommandModule,
    SensorCommandModule,
    OwnerQueryModule,
    SensorQueryModule,
    AuthModule,
    UsersModule,
  ],
})

export class AppModule {}
