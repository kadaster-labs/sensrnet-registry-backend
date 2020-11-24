import * as bcrypt from 'bcryptjs';
import { Schema } from 'mongoose';
import { User } from './user.interface';

export const UserSchema = new Schema({
    _id: { type: String, required: true },
    role: { type: String, required: false },
    password: { type: String, required: true },
    refreshToken: { type: String, required: false },
    organizationId: { type: String, required: false },
}, {
    autoCreate: true,
});

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

UserSchema.pre<User>('save', function(next) {
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
