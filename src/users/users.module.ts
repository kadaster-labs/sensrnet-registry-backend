import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSchema } from './models/user.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
  providers: [UsersService],
  exports: [UsersService],
})

export class UsersModule {}
