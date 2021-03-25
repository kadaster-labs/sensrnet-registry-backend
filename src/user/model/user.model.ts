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
    password: string;
    socialId: string;
    refreshToken?: string;

    checkPassword(pass: string, callback: (err, isMatch) => void): void;
    checkRefreshToken(token: string, callback: (err, isMatch) => void): void;
}

export const UserSchema = new Schema({
    _id: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    socialId: { type: String, required: false },
    refreshToken: { type: String, required: false },
}, {
    autoCreate: true,
});
UserSchema.index({ email: 1 }, { unique: true });

export const hashableFields = ['password', 'refreshToken'];

export const hashField = (field: string,
                          resolve: (data: string) => void,
                          reject: (error: any) => void): void => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            reject(err);
        } else {
            bcrypt.hash(field, salt, (herr, hash) => {
                if (herr) {
                    reject(herr);
                } else {
                    resolve(hash);
                }
            });
        }
    });
};

UserSchema.pre<IUser>('save', function(next) {
    const fields = [];
    const promises = [];
    const hashFunction = (hashableField) => (resolve, reject) => hashField(this[hashableField], resolve, reject);
    for (const hashableField of hashableFields) {
        if (this.isModified(hashableField)) {
            fields.push(hashableField);
            promises.push(new Promise(hashFunction(hashableField)));
        }
    }

    Promise.all(promises).then((data) => {
        for (let i = 0; i < data.length; i++) {
            this[fields[i]] = data[i];
        }
        return next();
    }, (err) => {
        return next(err);
    });
});

UserSchema.methods.checkPassword = function(attempt, callback) {
    bcrypt.compare(attempt, this.password, (err, isMatch) => {
        if (err) {
            return callback(err);
        } else {
            return callback(null, isMatch);
        }
    });
};

UserSchema.methods.checkRefreshToken = function(attempt, callback) {
    bcrypt.compare(attempt, this.refreshToken, (err, isMatch) => {
        if (err) {
            return callback(err);
        } else {
            return callback(null, isMatch);
        }
    });
};
