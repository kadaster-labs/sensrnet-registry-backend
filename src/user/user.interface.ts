import { Document } from 'mongoose';

export interface User extends Document {
    _id: string;
    role?: string;
    password: string;
    refreshToken?: string;
    legalEntityId?: string;

    checkPassword(pass: string, callback: (err, isMatch) => void): void;
    checkRefreshToken(token: string, callback: (err, isMatch) => void): void;
}
