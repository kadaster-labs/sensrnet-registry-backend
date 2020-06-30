import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../../../users/user.interface';
import { UserRegistered, UserDeleted } from 'src/events/user';
import { EventStorePublisher } from '../../../event-store/event-store.publisher';
import { UserAlreadyExistsException } from '../errors/user-already-exists-exception';

@Injectable()
export class UserProcessor {
    /* This processor processes user events. Events like soft-delete are not handled because they do not need to be processed. */

    constructor(
        private readonly eventStore: EventStorePublisher,
        @InjectModel('User') private userModel: Model<User>,
    ) {}

    protected logger: Logger = new Logger(this.constructor.name);

    async process(event): Promise<void> {
        if (event instanceof UserRegistered) {
            await this.processCreated(event);
        } else if (event instanceof UserDeleted) {
            await this.processDeleted(event);
        }
    }

    async processCreated(event: UserRegistered): Promise<void> {
        const userInstance = new this.userModel({
            role: 'user',
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

        let user = null;
        await savePromise.then(() => {
            user = {id: userInstance._id};
        }, () => {
            throw new UserAlreadyExistsException(event.email);
        });

        return user;
    }

    async processDeleted(event: UserDeleted): Promise<void> {
        this.userModel.deleteOne({_id: event.aggregateId}, (err) => {
            if (err) {
                this.logger.error('Error while deleting projection.');
            }
        });

        const eventMessage = event.toEventMessage();
        await this.eventStore.deleteStream(eventMessage.streamId);
    }
}
