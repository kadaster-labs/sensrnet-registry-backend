import {Module} from '@nestjs/common';
import { OwnerCommandModule } from './commands/owner/owner.module';
import { SensorCommandModule } from './commands/sensor/sensor.module';
import { OwnerQueryModule } from './query/owner/owner.module';
import { SensorQueryModule } from './query/sensor/sensor.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserQueryModule } from './query/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

const port = process.env.MONGO_PORT || 27017;
const host = process.env.MONGO_HOST || 'localhost';
const database = process.env.MONGO_DATABASE || 'sensrnet';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${host}:${port}/${database}`),
    AuthModule,
    UsersModule,
    OwnerCommandModule,
    SensorCommandModule,
    OwnerQueryModule,
    SensorQueryModule,
    UserQueryModule,
  ],
})

export class AppModule {}
