import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Organization } from '../query/data/organization.interface';
import { TokenSet } from 'openid-client';

export type UserDoc = User & Document;

@Schema()
export class User {
    @Prop()
    _id: string;

    @Prop()
    email: string;

    @Prop({ type: Types.Map })
    oidc?: TokenSet;

    @Prop({ type: Types.Map })
    local?: {
        password: string,
    };

    @Prop({ type: String })
    organizationId?: Organization['_id'];

    @Prop()
    role?: string;

    @Prop()
    refreshToken?: string;

    checkPassword(pass: string, callback: (err, isMatch?) => void): void {
      bcrypt.compare(pass, this.local?.password, (err, isMatch) => {
        if (err) {
          return callback(err);
        }

        return callback(null, isMatch);
      });
    }

    checkRefreshToken(token: string, callback: (err, isMatch?) => void): void {
      bcrypt.compare(token, this.refreshToken, (err, isMatch) => {
        if (err) {
          return callback(err);
        }

        return callback(null, isMatch);
      });
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

export const hashableFields = ['local.password', 'refreshToken'];
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

UserSchema.pre<UserDoc>('save', function (next) {
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
    for (let i = 0; i < data.length; i + 1) {
      this[fields[i]] = data[i];
    }
    return next();
  }, (err) => next(err));
});