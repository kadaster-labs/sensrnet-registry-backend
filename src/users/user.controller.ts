import {Model} from 'mongoose';
import {User} from './user.interface';
import { ApiTags } from '@nestjs/swagger';
import {InjectModel} from '@nestjs/mongoose';
import {AuthenticateBody} from '../auth/models/auth.model';
import {Controller, Post, Body, UseFilters} from '@nestjs/common';
import {UserExceptionFilter} from './errors/user-exception.filter';
import {UserAlreadyExistsException} from './errors/user-already-exists-exception';

@ApiTags('User')
@Controller()
export class UserController {

    constructor(@InjectModel('User') private userModel: Model<User>) {}

    @Post('user')
    @UseFilters(new UserExceptionFilter())
    async create(@Body() body: AuthenticateBody) {
        const userInstance = new this.userModel({
            username: body.username,
            password: body.password,
        });
        const savePromise = new Promise((resolve, reject) => userInstance.save((err) => {
            if (err) {
                reject();
            } else {
                resolve();
            }
        }));

        let result = null;
        await savePromise.then(() => {
            result = {id: userInstance._id};
        }, () => {
            throw new UserAlreadyExistsException(body.username);
        });

        return result;
    }
}
