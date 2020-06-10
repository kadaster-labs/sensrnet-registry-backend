import { Document } from 'mongoose';

export interface User extends Document {
    _id: string;
    ownerId: string;
    password: string;

    checkPassword(pass: string, param2: (err, isMatch) => void): void;
}
