import { Document } from 'mongoose';

export interface User extends Document {
    _id: string;
    email: string;
    
    oidc?: Record<string, unknown>;
    local?: Record<string, unknown>;
    
    organizationId?: string;
    role?: string;
    refreshToken?: string;

    checkPassword(pass: string, callback: (err, isMatch) => void): void;
    checkRefreshToken(token: string, callback: (err, isMatch) => void): void;
}
