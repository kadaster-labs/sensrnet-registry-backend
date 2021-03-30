import * as bcrypt from 'bcryptjs';
import { Document, Schema } from 'mongoose';

export enum UserRole {
    USER,
    ADMIN,
    SUPER_USER,
}

export interface IUserPermissions extends Document {
    _id: string;
    legalEntityId: string;
    role: UserRole;
}

export const UserPermissionsSchema = new Schema({
    _id: { type: String, required: true },
    legalEntityId: { type: String, required: true },
    role: { type: Number, required: false },
});
UserPermissionsSchema.index({ legalEntityId: 1 });

export interface IUser extends Document {
    _id: string;
    email: string;
    oidc: Record<string, any>;
    socialId: string;
}

export const UserSchema = new Schema({
    _id: { type: String, required: true },
    email: { type: String, required: true },
    oidc: { type: Object, required: false },
}, {
    autoCreate: true,
});
UserSchema.index({ email: 1 }, { unique: true });
