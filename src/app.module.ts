import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { OwnerQueryModule } from './query/owner/owner.module';
import { UserCommandModule } from './commands/user/user.module';
import { SensorQueryModule } from './query/sensor/sensor.module';
import { OwnerCommandModule } from './commands/owner/owner.module';
import { SensorCommandModule } from './commands/sensor/sensor.module';

const port = process.env.MONGO_PORT || 27017;
const host = process.env.MONGO_HOST || 'localhost';
const database = process.env.MONGO_DATABASE || 'sensrnet';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    OwnerQueryModule,
    SensorQueryModule,
    UserCommandModule,
    OwnerCommandModule,
    SensorCommandModule,
    MongooseModule.forRoot(`mongodb://${host}:${port}/${database}`),
  ],
})

export class AppModule {}
