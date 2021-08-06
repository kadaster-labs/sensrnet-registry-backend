import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPermissions, UserPermissionsSchema } from './user-permissions.schema';
import { UserQueryService } from './user.qry-service';
import { User, userSchema } from './user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
        MongooseModule.forFeature([{ name: UserPermissions.name, schema: UserPermissionsSchema }]),
    ],
    providers: [UserQueryService],
    exports: [UserQueryService],
})
export class UserModule {}
