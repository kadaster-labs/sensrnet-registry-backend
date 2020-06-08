import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.model';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
