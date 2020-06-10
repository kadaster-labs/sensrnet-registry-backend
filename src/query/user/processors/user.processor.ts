import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {UserRegistered} from 'src/events/user';
import {Injectable, Logger} from '@nestjs/common';
import {User} from '../../../users/user.interface';
import {UserAlreadyExistsException} from '../errors/user-already-exists-exception';

@Injectable()
export class UserProcessor {

    constructor(@InjectModel('User') private userModel: Model<User>) {}

    protected logger: Logger = new Logger(this.constructor.name);

    async process(event): Promise<void> {
        if (event instanceof UserRegistered) {
            await this.processCreated(event);
        } else {
            this.logger.warn(`Caught unsupported event: ${event}`);
        }
    }

    async processCreated(event: UserRegistered): Promise<void> {
        const userInstance = new this.userModel({
            _id: event.email,
            ownerId: event.ownerId,
            password: event.password,
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
            throw new UserAlreadyExistsException(event.email);
        });

        return result;
    }
}
