import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Organization } from '../query/data/organization.interface';

export type UserDoc = User & Document;

@Schema()
export class User {
    @Prop()
    _id: string;

    @Prop()
    email: string;

    @Prop({ type: Types.Map })
    oidc?: Record<string, any>;

    @Prop({ type: String })
    organizationId?: Organization['_id'];

    @Prop()
    role?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
