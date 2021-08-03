import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true, index: true, unique: true })
  email: string;

  @Prop({ type: Object })
  oidc: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);
