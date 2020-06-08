import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User} from './user.interface';
import {AuthenticateBody} from '../auth/models/auth.model';

@ApiTags('User')
@Controller()
export class UserController {

    constructor(@InjectModel('User') private userModel: Model<User>) {}

    @Post('user')
    async create(@Body() body: AuthenticateBody) {
        const userInstance = new this.userModel({
            username: body.username,
            password: body.password,
        });
        await userInstance.save();
    }
}
