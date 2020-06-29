import * as bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import { User } from '../user.interface';

export const UserSchema = new Schema({
    _id: { type: String, required: true },
    ownerId: { type: String, required: true },
    password: { type: String, required: true },
    isStaff: { type: Boolean, required: false },
    isAdmin: { type: Boolean, required: false },
});

UserSchema.pre<User>('save', function(next) {
    const user = this;

    // Make sure not to rehash the password if it is already hashed
    if (!user.isModified('password')) {
        return next();
    }

    // Generate a salt and use it to hash the user's password
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, (herr, hash) => {
            if (herr) {
                return next(herr);
            }

            user.password = hash;
            next();
        });
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
