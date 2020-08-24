import * as bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import { User } from './user.interface';

export const UserSchema = new Schema({
    _id: { type: String, required: true },
    role: { type: String, required: false },
    ownerId: { type: String, required: false },
    password: { type: String, required: true },
    refreshToken: { type: String, required: false },
}, {
    autoCreate: true,
});

export const hashableFields = ['password', 'refreshToken'];

export const hashField = (field, resolve, reject) => {
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
    const user = this;

    const fields = [];
    const promises = [];
    const hashFunction = (hashableField) => (resolve, reject) => hashField(user[hashableField], resolve, reject);
    for (const hashableField of hashableFields) {
        if (user.isModified(hashableField)) {
            fields.push(hashableField);
            promises.push(new Promise(hashFunction(hashableField)));
        }
    }

    Promise.all(promises).then((data) => {
        for (let i = 0; i < data.length; i++) {
            user[fields[i]] = data[i];
        }
        return next();
    }, (err) => {
        return next(err);
    });
});

UserSchema.methods.checkPassword = function(attempt, callback) {
    const user = this;

    bcrypt.compare(attempt, user.password, (err, isMatch) => {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

UserSchema.methods.checkRefreshToken = function(attempt, callback) {
    const user = this;

    bcrypt.compare(attempt, user.refreshToken, (err, isMatch) => {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};
