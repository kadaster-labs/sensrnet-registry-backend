import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  USER,
  ADMIN,
  SUPER_USER
}

export type UserPermissionsDocument = UserPermissions & Document;

@Schema({
  autoCreate: true,
  collection: 'userpermissions',  // for backwards compatibility, as default is classname + 's', which would be userpermissionss
})
export class UserPermissions {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true, index: true })
  legalEntityId: string;

  @Prop({ type: Number })
  role: UserRole;
}

export const UserPermissionsSchema = SchemaFactory.createForClass(UserPermissions);
