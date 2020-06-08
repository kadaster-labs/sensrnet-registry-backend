import { Document } from 'mongoose';

export interface User extends Document {
    username: string;
    password: string;
    provider: string;
    email: string;
    role: number;

    checkPassword(pass: string, param2: (err, isMatch) => void): void;
}
