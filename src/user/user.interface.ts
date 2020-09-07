import { Document } from 'mongoose';

export interface User extends Document {
    _id: string;
    role?: string;
    ownerId?: string;
    password: string;
    refreshToken?: string;

    checkPassword(pass: string, callback: (err, isMatch) => void): void;
    checkRefreshToken(token: string, callback: (err, isMatch) => void): void;
}
