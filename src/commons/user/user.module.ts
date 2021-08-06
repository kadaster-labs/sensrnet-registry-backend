import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserQueryService } from './user.qry-service';
import { UserPermissionsSchema, UserSchema } from './user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'UserPermissions', schema: UserPermissionsSchema }]),
    ],
    providers: [UserQueryService],
    exports: [UserQueryService],
})
export class UserModule {}
